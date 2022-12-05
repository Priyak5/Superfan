from rest_framework import serializers

from users.models import Media


class UserCreateRequestSerializer(serializers.Serializer):
    ethereum_address = serializers.CharField(max_length=150, required=True, allow_blank=False)
    signature_hash = serializers.CharField(max_length=150, required=True, allow_blank=False)


class UserCreateResponseJWTCredentails(serializers.Serializer):
    refresh = serializers.CharField(max_length=150, required=True)
    access = serializers.CharField(max_length=150, required=True)


class UserProfileRequestSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150, required=False)
    ticker = serializers.CharField(max_length=7, required=False)
    price = serializers.IntegerField(min_value=1, required=False)
    file = serializers.FileField(required=False)

class MediaResponseSerializer(serializers.Serializer):
    media_id = serializers.CharField()
    media_url = serializers.CharField()


class UserProfileResponseSerializer(serializers.Serializer):
    user_id = serializers.CharField()
    ethereum_address = serializers.CharField(max_length=150, required=True)
    name = serializers.CharField(max_length=150)
    ticker = serializers.CharField(max_length=7)
    price = serializers.CharField(default="")
    profile_pic = serializers.CharField(default="")
    posts = MediaResponseSerializer(many=True)
    contract_address = serializers.CharField()
    nft_creation_status = serializers.CharField()


class UserCreateResponseSerializer(serializers.Serializer):
    ethereum_address = serializers.CharField(max_length=150, required=True)
    jwt_credentials = UserCreateResponseJWTCredentails(required=True)
    user_id = serializers.CharField()
    name = serializers.CharField(max_length=150)
    ticker = serializers.CharField(max_length=7)
    price = serializers.IntegerField(min_value=1)
    profile_pic = serializers.CharField()


class UserNameRequestSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150, required=True, allow_blank=False)


class UserNameResponseSerializer(serializers.Serializer):
    ethereum_address = serializers.CharField(max_length=150, required=True)
    name = serializers.CharField(max_length=150, allow_blank=True)
    ticker = serializers.CharField(max_length=7, allow_blank=True)
    price = serializers.IntegerField(min_value=1, allow_null=True)
    profile_pic = serializers.CharField()


class SearchResponseSerializer(serializers.Serializer):
    user_id = serializers.CharField()
    name = serializers.CharField()
    ticker = serializers.CharField()
    price = serializers.CharField()
    profile_pic = serializers.CharField()


class UploadMediaSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
    media_type = serializers.ChoiceField(
        choices=Media.REFERENCE_TYPE_LIST)

