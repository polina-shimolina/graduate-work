import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms as T
import torchvision
import torch.nn.functional as F
from torch.autograd import Variable
from torchviz import make_dot

from PIL import Image
import cv2
import albumentations as A

import time
import os
from tqdm.notebook import tqdm

from torchsummary import summary
import segmentation_models_pytorch as smp


class DroneTestDataset(Dataset):
  """
  Пользовательский датасет для тестирования модели дронов на изображениях.

  Args:
  - img_path (str): Путь к папке с изображениями.
  - mask_path (str): Путь к папке с масками.
  - X (list): Список имен файлов без расширений.
  - transform: Преобразование изображений (опционально).

  Returns:
  Кортеж (img, mask) с изображением и маской.

  Note:
  - Изображения считываются в формате RGB.
  - Маска преобразуется с помощью функции convert_mask (необходимо определить).
  - Применяются аугментации, если указан параметр transform.
  """
  def __init__(self, img_path, mask_path, X, transform=None):
    self.img_path = img_path
    self.mask_path = mask_path
    self.X = X
    self.transform = transform

  def __len__(self):
    return len(self.X)

  def __getitem__(self, idx):
    img = cv2.imread(self.img_path + self.X[idx] + '.jpg')
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    mask_bgr = cv2.imread(self.mask_path + self.X[idx] + '.png')
    mask_rgb = cv2.cvtColor(mask_bgr, cv2.COLOR_BGR2RGB)

    mask = convert_mask(mask_rgb)
    #mask = mask_rgb

    if self.transform is not None:
      aug = self.transform(image=img, mask=mask)
      img = Image.fromarray(aug['image'])
      mask = aug['mask']

    if self.transform is None:
      img = Image.fromarray(img)

    mask = torch.from_numpy(mask).long()

    return img, mask


t_test = A.Resize(768, 1152, interpolation=cv2.INTER_NEAREST)
test_set = DroneTestDataset(IMAGE_PATH, MASK_PATH, X_test, transform=t_test)
image, mask = test_set[3]


def mask_to_color(mask):
    COLOR_MAPPING = {
        0: (226, 169, 41),   # Water
        1: (132, 41, 246),   # Land (unpaved area)
        2: (110, 193, 228),  # Road
        3: (60, 16, 152),    # Building
        4: (254, 221, 58),   # Vegetation
        5: (155, 155, 155)   # Unlabeled
    }
    h, w = mask.shape
    color_image = np.zeros((h, w, 3), dtype=np.uint8)

    for class_index, color in COLOR_MAPPING.items():
        color_image[mask == class_index] = color

    return color_image


def predict_image_mask(model, image, mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]):
  """
    Функция для предсказания маски изображения с использованием модели.

    Args:
    - model: Обученная модель для предсказания маски.
    - image: Входное изображение для предсказания маски.
    - mean (list): Средние значения для нормализации изображения.
    - std (list): Стандартные отклонения для нормализации изображения.
    """
  model.eval()
  t = T.Compose([T.ToTensor(), T.Normalize(mean, std)])
  image = t(image)
  model.to(device); image=image.to(device)
  with torch.no_grad():

    image = image.unsqueeze(0)

    output = model(image)
    masked = torch.argmax(output, dim=1)
    masked = masked.cpu().squeeze(0)
  return masked


def get_image(path):
    image = cv2.imread(path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(image)

    resize_transform = T.Resize((768, 1152), interpolation=Image.NEAREST)
    resized_image = resize_transform(image)

    return resized_image

def predict(path):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = torch.load('mysite\ml_model\Unet-Mobilenet.pt')
    model.eval()
    model.to(device)

    image = get_image(path)

    pred_mask = predict_image_mask(model, image)
    pred_mask_np = pred_mask.numpy()
    color_pred_mask = mask_to_color(pred_mask_np)

    return color_pred_mask
