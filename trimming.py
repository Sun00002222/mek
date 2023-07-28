# https://note.nkmk.me/python-pillow-image-crop-trimming/

from PIL import Image

trimming_filename = 'background.png' # png, jpeg, ...
save_filename = 'background_trimmed.png' # png, jpeg, ...

im = Image.open(trimming_filename)

def crop_center(pil_img, crop_width, crop_height):
    img_width, img_height = pil_img.size
    return pil_img.crop(((img_width - crop_width) // 2,
                         (img_height - crop_height) // 2,
                         (img_width + crop_width) // 2,
                         (img_height + crop_height) // 2))

def crop_max_square(pil_img):
    return crop_center(pil_img, min(pil_img.size), min(pil_img.size))

im_new = crop_max_square(im)
im_new.save(save_filename, quality=95)

