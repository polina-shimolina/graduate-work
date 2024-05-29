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

import time
import os
from tqdm.notebook import tqdm

from torchsummary import summary
import segmentation_models_pytorch as smp

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

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
  model.to(device); 
  image=image.to(device)
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
    
    # model = torch.load('C:\\Users\\user\\Desktop\\graduate-work\\mysite\\ml_model\\deepllabv3-Mobilenet.pt')
    model = torch.load('C:\\Users\\user\\Desktop\\graduate-work\\mysite\\ml_model\\Unet-Mobilenet.pt')
    # model = torch.load('C:\\Users\\user\\Desktop\\graduate-work\\mysite\\ml_model\\Linknet-Mobilenet.pt')
    model.eval()
    model.to(device)

    image = get_image(path)

    pred_mask = predict_image_mask(model, image)
    pred_mask_np = pred_mask.numpy()
    color_pred_mask = mask_to_color(pred_mask_np)

    return color_pred_mask
