import uuid

from django.db import transaction
from django.db.models import Q
from django.db.transaction import atomic
from django.shortcuts import render

# Create your views here.
from rest_framework import views, generics, status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from users import serializers
from users.models import User, UserNFT, Media
from users import services

from django.conf import settings

import logging

from users.serializers import UserProfileRequestSerializer, UserProfileResponseSerializer, UserNameRequestSerializer, \
    UserNameResponseSerializer, SearchResponseSerializer, UploadMediaSerializer
from users.tasks import refresh_contract_address, refresh_nft_status

logger = logging.getLogger(__name__)


class CreateUserView(generics.GenericAPIView):
    request_serializer = serializers.UserCreateRequestSerializer
    response_serializer = serializers.UserCreateResponseSerializer

    def post(self, request):
        try:
            serializer = self.request_serializer(data=request.data)
            if serializer.is_valid(raise_exception=False) is False:
                return Response(data={
                    "message": "Error creating user",
                    "error_msg": serializer.errors,
                    "payload": "",
                }, status=status.HTTP_400_BAD_REQUEST)

            validated_data = dict(serializer.validated_data)
            ethereum_address = validated_data.get("ethereum_address")
            signature_hash = validated_data.get("signature_hash")

            if services.verify_signature(
                public_address=ethereum_address,
                text_msg=settings.LOGIN_MSG,
                signature=signature_hash,
            ) is False:
                return Response(data={
                    "message": "Signature did not match.",
                    "error_msg": "Signature did not match.",
                    "payload": "",
                }, status=status.HTTP_400_BAD_REQUEST)

            user_created = False
            try:
                user = User.objects.get(ethereum_address=ethereum_address)
            except User.DoesNotExist:
                user = User.create_user_without_nft_creds(
                    ethereum_address=ethereum_address,
                )
                user_created = True

            token = RefreshToken.for_user(user)

            user_nft: UserNFT = UserNFT.objects.filter(user=user).first()
            if user_nft is None:
                response_payload = {
                    "ethereum_address": ethereum_address,
                    "jwt_credentials": {
                        "refresh": str(token),
                        "access": str(token.access_token),
                    },
                    "user_id": str(user.id),
                    "name": user.name,
                    "ticker": "",
                    "price": None,
                    "profile_pic": user.profile_pic,
                }
            else:
                response_payload = {
                    "ethereum_address": ethereum_address,
                    "jwt_credentials": {
                        "refresh": str(token),
                        "access": str(token.access_token),
                    },
                    "user_id": str(user.id),
                    "name": user.name,
                    "ticker": user_nft.ticker,
                    "price": user_nft.price,
                    "profile_pic": user.profile_pic,
                }

            success_msg = "Successfully created user" if user_created else "User already exists"
            response_serializer = self.response_serializer(response_payload)
            return Response(data={
                "message": f"{success_msg}",
                "error_msg": "",
                "payload": response_serializer.data,
            }, status=status.HTTP_200_OK)

        except Exception:
            logger.error(f"exception occured in {self.__class__.__name__}", exc_info=True)
            return Response(data={
                "message": "",
                "error_msg": "Something went wrong.",
                "payload": "",
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateName(generics.GenericAPIView):
    request_serializer = UserNameRequestSerializer
    response_serializer = UserNameResponseSerializer

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request_serializer = self.request_serializer(data=request.data)
            if request_serializer.is_valid(raise_exception=False) is False:
                return Response(data={
                    "message": "Error creating user",
                    "error_msg": request_serializer.errors,
                    "payload": "",
                }, status=status.HTTP_400_BAD_REQUEST)

            data = dict(request_serializer.validated_data)
            name = data.get("name")

            user = request.user
            user.name = name
            user.save()

            user_nft: UserNFT = UserNFT.objects.filter(user=request.user).first()
            if user_nft is None:
                response_data = {
                    "ethereum_address": user.ethereum_address,
                    "name": user.name,
                    "ticker": "",
                    "price": None,
                    "profile_pic": user.profile_pic,
                }

                return Response(data={
                    "message": "Successfully updated name",
                    "error_msg": "",
                    "payload": self.response_serializer(response_data).data,
                }, status=status.HTTP_200_OK)

            else:
                response_data = {
                    "ethereum_address": user.ethereum_address,
                    "name": user.name,
                    "ticker": user_nft.ticker,
                    "price": user_nft.price,
                    "profile_pic": user.profile_pic,
                }

                return Response(data={
                    "message": "Successfully updated name",
                    "error_msg": "",
                    "payload": self.response_serializer(response_data).data,
                }, status=status.HTTP_200_OK)


        except Exception:
            logger.error(f"exception occured in {self.__class__.__name__}", exc_info=True)
            return Response(data={
                "message": "",
                "error_msg": "Something went wrong.",
                "payload": "",
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetProfileDetails(generics.GenericAPIView):
    response_serializer = UserProfileResponseSerializer

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, user_id):

        try:
            user = User.objects.get(id=user_id)
            user_nft: UserNFT = UserNFT.objects.filter(user=user).first()
            posts = Media.objects.filter(
                user=user, reference_type=Media.REFERENCE_TYPE_POST
            ).order_by("-id")[:]

            if user_nft.nft_creation_status == UserNFT.STATUS_PENDING:
                refresh_nft_status.delay(user_nft.id)

            if request.user.id == user.id or (isinstance(request.user, User) is True and services.user_owns_nft(
                    request.user.ethereum_address, user_nft.contract_address)):
                posts_data = [{"media_id": str(post.id), "media_url": post.media_url} for post in posts]
            else:
                posts_data = [{"media_id": str(post.id), "media_url": ""} for post in posts]

            response_payload = {
                "user_id": str(user.id),
                "ethereum_address": user.ethereum_address,
                "name": user.name,
                "ticker": getattr(user_nft or object(), "ticker", ""),
                "price": getattr(user_nft or object(), "price", ""),
                "profile_pic": user.profile_pic,
                "contract_address": user_nft.contract_address,
                "nft_creation_status": user_nft.nft_creation_status,
                "posts": posts_data,
            }
            return Response(data={
                "message": "Successfully retrieved data",
                "error_msg": "",
                "payload": self.response_serializer(response_payload).data,
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(data={
                "message": "User does not exists",
                "error_msg": "",
                "payload": "",
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception:
            logger.error(f"exception occured in {self.__class__.__name__}", exc_info=True)
            return Response(data={
                "message": "",
                "error_msg": "Something went wrong.",
                "payload": "",
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateProfile(generics.GenericAPIView):
    request_serializer = UserProfileRequestSerializer
    response_serializer = UserProfileResponseSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request_serializer = self.request_serializer(data=request.data)
            if request_serializer.is_valid(raise_exception=False) is False:
                return Response(data={
                    "message": "Error creating user",
                    "error_msg": request_serializer.errors,
                    "payload": "",
                }, status=status.HTTP_400_BAD_REQUEST)

            validated_data = dict(request_serializer.validated_data)
            name = validated_data.get("name")
            ticker = validated_data.get("ticker", "").upper()
            price = validated_data.get("price")
            file = validated_data.get("file")
            user = request.user

            with transaction.atomic():
                if file:

                    # upload profile pic
                    _, ext = Media.retrieve_filename_and_extension(
                        file.name,
                    )
                    media = Media.objects.create(
                        user=user,
                        reference_id=str(uuid.uuid4()),
                        reference_type=Media.REFERENCE_TYPE_PROFILE_PIC,
                        file_extension=ext,
                    )
                    services.upload_file(
                        file,
                        settings.STORJ_CONFIG["media_bucket"],
                        media.file_name
                    )
                    user.profile_pic = media
                    user.save()

                posts = Media.objects.filter(
                    user=user, reference_type=Media.REFERENCE_TYPE_POST
                ).order_by("-id")[:]
                posts_data = [{"media_id": str(post.id), "media_url": post.media_url} for post in posts]

                user_nft: UserNFT = UserNFT.objects.filter(user=user).first()
                if user_nft is not None:
                    user.name = name if isinstance(name, str) and len(name) > 0 else user.name
                    user_nft.ticker = ticker if isinstance(ticker, str) and len(ticker) > 0 else user_nft.ticker
                    user_nft.price = price if price > 0 else user_nft.price
                    user.save()
                    user_nft.save()

                    if user_nft.nft_creation_status == UserNFT.STATUS_PENDING:
                        print("calling background method")
                        refresh_nft_status.delay(user_nft.id)

                    response_payload = {
                        "user_id": str(user.id),
                        "ethereum_address": user.ethereum_address,
                        "name": user.name,
                        "ticker": user_nft.ticker,
                        "price": user_nft.price,
                        "profile_pic": user.profile_pic,
                        "posts": posts_data,
                        "contract_address": user_nft.contract_address,
                        "nft_creation_status": user_nft.nft_creation_status
                    }
                    return Response(data={
                        "message": "Successfully updated user details",
                        "error_msg": "",
                        "payload": self.response_serializer(response_payload).data,
                    }, status=status.HTTP_200_OK)

                # create NFT
                with transaction.atomic():
                    user_nft = UserNFT.create_user_nft(user=user, ticker=ticker, price=price)
                    user.name = name or user.name
                    user.save()

                    # create NFT
                    tx = services.deploy_contract_for_creator(
                        user.ethereum_address,
                        user_nft.price,
                        str(user.id),
                        user.name,
                        user_nft.ticker,
                        ""
                    )
                    user_nft.transaction_hash = tx
                    user_nft.save()

                    response_payload = {
                        "user_id": str(request.user.id),
                        "ethereum_address": request.user.ethereum_address,
                        "name": request.user.name,
                        "ticker": user_nft.ticker,
                        "price": user_nft.price,
                        "profile_pic": user.profile_pic,
                        "posts": posts_data,
                        "contract_address": user_nft.contract_address,
                        "nft_creation_status": user_nft.nft_creation_status
                    }
                    return Response(data={
                        "message": "Successfully updated user details",
                        "error_msg": "",
                        "payload": self.response_serializer(response_payload).data,
                    }, status=status.HTTP_200_OK)

        except Exception:
            logger.error(f"exception occured in {self.__class__.__name__}", exc_info=True)
            return Response(data={
                "message": "",
                "error_msg": "Something went wrong.",
                "payload": "",
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SearchUserView(generics.GenericAPIView):
    response_serializer = SearchResponseSerializer

    def get(self, request):
        query_params = dict(request.query_params)
        q = query_params.get("q", "")

        try:
            if q:
                user_nfts = UserNFT.objects.select_related("user").filter(
                    Q(ticker__icontains=q[0]) |
                    Q(user__name__icontains=q[0])
                ).order_by("-id")
            else:
                user_nfts = UserNFT.objects.select_related(
                    "user").order_by("-id")

            user_response = [{
                "user_id": str(user_nft.user.id),
                "name": user_nft.user.name,
                "ticker": getattr(
                    user_nft, "ticker", ""),
                "price": getattr(
                    user_nft, "price", ""),
                "profile_pic": user_nft.user.profile_pic,
            } for user_nft in user_nfts]

            return Response(data={
                "message": "Successfully retrieved users",
                "error_msg": "",
                "payload": self.response_serializer(user_response, many=True).data,
            })

        except Exception:
            logger.error(f"exception occured in {self.__class__.__name__}", exc_info=True)
            return Response(data={
                "message": "",
                "error_msg": "Something went wrong.",
                "payload": "",
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UploadMedia(generics.GenericAPIView):
    request_serializer = UploadMediaSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.request_serializer(data=request.data)
        if serializer.is_valid(raise_exception=False) is False:
            return Response(data={
                "message": "Error creating user",
                "error_msg": serializer.errors,
                "payload": "",
            }, status=status.HTTP_400_BAD_REQUEST)

        data = dict(serializer.validated_data)

        file = data["file"]
        media_type = data["media_type"]
        reference_id = uuid.uuid4()
        _, file_ext = Media.retrieve_filename_and_extension(file.name)

        try:
            with transaction.atomic():
                media = Media.objects.create(
                    user=request.user,
                    reference_id=reference_id,
                    reference_type=media_type,
                    file_extension=file_ext,
                )
                services.upload_file(
                    file,
                    settings.STORJ_CONFIG["media_bucket"],
                    media.file_name
                )
                response_data = {
                    "media_id": media.id,
                    "media_url": media.media_url,
                }
                return Response(
                    data=response_data,
                    status=status.HTTP_200_OK
                )
        except Exception:
            logger.error(f"exception occured in {self.__class__.__name__}", exc_info=True)
            return Response(data={
                "message": "",
                "error_msg": "Something went wrong.",
                "payload": "",
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
