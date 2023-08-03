from django.db import models

# Create your models here.
class pill_img_info(models.Model):
    item_seq = models.CharField(max_length=50)
    dl_name = models.CharField(max_length=50)
    img_key = models.CharField(max_length=500)
    drug_shape = models.CharField(max_length=50)
    print_front = models.CharField(max_length=50)
    print_back = models.CharField(max_length=50)
    color_class1= models.CharField(max_length=50)
    color_class2 = models.CharField(max_length=50)

    def __str__(self):
        return self.item_seq
