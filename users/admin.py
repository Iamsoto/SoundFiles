from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from .forms import CreateUserForm, UserChangeForm
from .models import SoundFileUser


class SoundFileUserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = CreateUserForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'is_admin')
    list_filter = ('email', 'is_admin',)
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password','activation_code')}),
        ('Permissions', {'fields': ('is_admin','valid_email')}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username','password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()


admin.site.register(SoundFileUser, SoundFileUserAdmin)
admin.site.unregister(Group)