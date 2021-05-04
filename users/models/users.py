from django.db import models
from django.conf import settings
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)


class SoundFileUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email
        and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
        )

        if password:
            user.set_password(password)
        else:
            user.set_password("N/A")
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        """
        Creates and saves a superuser with the given email
        and password.
        """
        user = self.create_user(email, password=password)
        user.is_admin = True
        user.valid_email = True
        user.save(using=self._db)
        return user


class SoundFileUser(AbstractBaseUser):
    """
    Custom Django Authentication user
    """
    username = models.CharField(max_length=22,blank=True, null=True) # Not necessarily to be unqiue
    email = models.EmailField(max_length=254, unique=True, blank=False, null=False)
    join_date = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    valid_email = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)  
    news_letter = models.BooleanField(default=False)
    score = models.IntegerField(default =0)
    activation_code = models.CharField(max_length=255, null=True, blank=True)
    membership = models.IntegerField(default=0)

    objects = SoundFileUserManager()


    USERNAME_FIELD = 'email' # Email must be unique
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    def __str__(self):
        return self.email

    """
        The following are required for admin
        see: 
        https://docs.djangoproject.com/en/3.1/topics/auth/
        customizing/#custom-users-admin-full-example
        for details
    """
    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin