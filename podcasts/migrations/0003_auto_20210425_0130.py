# Generated by Django 3.1.5 on 2021-04-25 01:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('podcasts', '0002_auto_20210425_0116'),
    ]

    operations = [
        migrations.AlterField(
            model_name='podcast',
            name='author',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='podcast',
            name='etag',
            field=models.TextField(default='N/A'),
        ),
        migrations.AlterField(
            model_name='podcast',
            name='last_modified',
            field=models.TextField(default='N/A'),
        ),
        migrations.AlterField(
            model_name='podcast',
            name='name',
            field=models.TextField(blank=True, null=True),
        ),
    ]