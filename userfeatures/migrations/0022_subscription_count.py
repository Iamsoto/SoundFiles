# Generated by Django 3.1.5 on 2021-04-20 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userfeatures', '0021_subscription_sub_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscription',
            name='count',
            field=models.IntegerField(default=0),
        ),
    ]
