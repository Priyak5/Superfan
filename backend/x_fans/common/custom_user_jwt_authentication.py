from rest_framework_simplejwt.authentication import JWTAuthentication

from users import models as user_models


class CustomUserJWTAuthentication(JWTAuthentication):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # force user_model to be custom user model
        self.user_model = user_models.User

