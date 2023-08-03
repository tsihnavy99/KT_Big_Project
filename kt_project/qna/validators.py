from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

def validate_file_extension(value):
    allowed_extensions = ['jpg', 'jpeg', 'png', 'gif']
    extension = value.name.split('.')[-1].lower()
    if extension not in allowed_extensions:
        raise ValidationError(f"File extension '{extension}' is not allowed.")


@deconstructible
class FileExtensionValidator:
    def __init__(self, allowed_extensions):
        self.allowed_extensions = allowed_extensions

    def __call__(self, value):
        extension = value.name.split('.')[-1].lower()
        if extension not in self.allowed_extensions:
            raise ValidationError(f"File extension '{extension}' is not allowed.")

validate_file_extension = FileExtensionValidator(['jpg', 'jpeg', 'png', 'gif'])
