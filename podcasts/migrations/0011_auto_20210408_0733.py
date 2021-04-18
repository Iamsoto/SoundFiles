# Generated by Django 3.1.5 on 2021-04-08 07:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('podcasts', '0010_auto_20210408_0728'),
    ]

    operations = [
        migrations.AlterField(
            model_name='podcastcategory',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='podcast_links', to='podcasts.category'),
        ),
        migrations.AlterField(
            model_name='podcastcategory',
            name='podcast',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='category_links', to='podcasts.podcast'),
        ),
    ]
