import uuid

from django.conf import settings
from django.db import models

# Create your models here.
from users import services


class User(models.Model):
    ethereum_address = models.CharField(max_length=150, db_index=True)
    name = models.CharField(max_length=200, default="", db_index=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    @property
    def is_authenticated(self):
        return True

    @property
    def profile_pic(self):
        return getattr(
            self.media.filter(
                reference_type=Media.REFERENCE_TYPE_PROFILE_PIC).last() or object(),
            "media_url",
            ""
        )

    def __str__(self):
        return f"<{self.id}: {self.ethereum_address}>"


    @classmethod
    def create_user_without_nft_creds(cls, ethereum_address):
        # user create
        user = cls.objects.create(
            ethereum_address=ethereum_address,
        )

        return user

    @classmethod
    def create_user_with_nft_creds(cls, ethereum_address, name, ticker: str = "", price: int = None):
        # user create
        user = cls.objects.create(
            ethereum_address=ethereum_address,
            name=name,
        )

        # create UserNFT
        user_nft = UserNFT.create_user_nft(
            user=user,
            ticker=ticker,
            price=price,
        )

        return user


class UserNFT(models.Model):
    # if price is not specified, charge 0.1 eth as fee
    DEFAULT_PRICE = 0

    STATUS_PENDING = "PENDING"
    STATUS_SUCCESS = "SUCCESS"
    STATUS_FAILURE = "FAILURE"

    STATUS_LIST = [
        (STATUS_PENDING, STATUS_PENDING),
        (STATUS_SUCCESS, STATUS_SUCCESS),
        (STATUS_FAILURE, STATUS_FAILURE),
    ]

    user = models.ForeignKey(to="User", related_name="nft_details", on_delete=models.SET_NULL, null=True)
    ticker = models.CharField(max_length=7, unique=True, db_index=True)
    price = models.PositiveIntegerField(null=True)

    transaction_hash = models.CharField(max_length=150, blank=True, default="")
    nft_creation_status = models.CharField(max_length=100, choices=STATUS_LIST, default=STATUS_PENDING)
    contract_address = models.CharField(max_length=150)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    def __str__(self):
        return f"{self.ticker}: {self.price}"


    @classmethod
    def create_user_nft(cls, user: "User", ticker: str = "", price: int = None):

        if isinstance(user, User) is False:
            raise ValueError(f"Expected <User> instance. Got <{type(user)}>")

        if isinstance(ticker, str) is False:
            raise ValueError(f"Expected <str> instance. Got <{type(ticker)}>")

        if isinstance(price, int) is False and price is not None:
            raise ValueError(f"Expected <int> instance. Got <{type(price)}>")

        # if ticker is not specified
        if len(ticker) == 0:
            ticker = user.name[0:3]

        # if price is not specified, charge 0.1 eth as fee
        if price is None:
            price = cls.DEFAULT_PRICE

        user_nft = cls.objects.create(
            user=user,
            ticker=ticker,
            price=price
        )
        return user_nft


class Media(models.Model):
    REFERENCE_TYPE_POST = "POST"
    REFERENCE_TYPE_PROFILE_PIC = "PROFILE_PIC"
    REFERENCE_TYPE = "NFT"

    REFERENCE_TYPE_LIST = [
        (REFERENCE_TYPE_POST, REFERENCE_TYPE_POST),
        (REFERENCE_TYPE_PROFILE_PIC, REFERENCE_TYPE_PROFILE_PIC),
    ]

    user = models.ForeignKey(
        User, on_delete=models.SET_NULL,
        related_name="media", null=True)
    reference_id = models.UUIDField(default=uuid.uuid4)
    reference_type = models.CharField(
        max_length=20, db_index=True, choices=REFERENCE_TYPE_LIST)
    file_extension = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    def __str__(self):
        return f"{self.id}:{self.reference_id}"

    @property
    def file_name(self):
        return f"{self.reference_id}.{self.file_extension}"

    @property
    def media_url(self):
        file_name = self.file_name
        return services.generate_presigned_bucket_url(
            bucket_name=settings.STORJ_CONFIG["media_bucket"],
            object_name=file_name,
            expires_in=24*60*60,
        )

    @staticmethod
    def retrieve_filename_and_extension(file_name):
        return file_name.split(".")
