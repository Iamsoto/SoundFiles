# Generated by Django 3.1.5 on 2021-04-25 02:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('podcasts', '0005_auto_20210425_0132'),
    ]

    operations = [
        migrations.AlterField(
            model_name='episode',
            name='media_url',
            field=models.URLField(max_length=1024),
        ),
        migrations.AlterField(
            model_name='podcast',
            name='image_url',
            field=models.URLField(blank=True, max_length=1024, null=True),
        ),
    ]