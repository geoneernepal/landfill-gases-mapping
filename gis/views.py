from multiprocessing import context
from django.http import HttpResponse
from django.shortcuts import render
import requests
import json
import ee

# ee.Authenticate()
ee.Initialize()

# Create your views here.
def index(request):
      
    roiSisdol = ee.Geometry.Polygon([
          [
            [
              85.220947265625,
              27.755861251169826
            ],
            [
              85.27210235595702,
              27.755861251169826
            ],
            [
              85.27210235595702,
              27.796717375115403
            ],
            [
              85.220947265625,
              27.796717375115403
            ],
            [
              85.220947265625,
              27.755861251169826
            ]
          ]
        ])

    tiles = LST('2020-01-01','2020-06-20', roiSisdol)

    
          


          











#just true color

    # roi = ee.Geometry.Polygon([
    #       [
    #         [
    #           85.22850036621094,
    #           27.83983506087852
    #         ],
    #         [
    #           85.33355712890625,
    #           27.83983506087852
    #         ],
    #         [
    #           85.33355712890625,
    #           27.91145753899194
    #         ],
    #         [
    #           85.22850036621094,
    #           27.91145753899194
    #         ],
    #         [
    #           85.22850036621094,
    #           27.83983506087852
    #         ]
    #       ]
    #     ])

    # sisdol = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR').filterBounds(roi).filterDate('2020-01-01','2020-06-30').sort('CLOUD_COVER').first().clip(roi)
    # def vis_param():
    #   vizParams2 = {
    #         'bands':['B4','B3','B2'],
    #         'min':-353.26,
    #         'max':1650.26,
    #         'gamma':1,
    #         'opacity':1,
    #       };
    #   return vizParams2
    
    # map_id_dict = ee.Image(sisdol).getMapId(vis_param())
    # tile = str(map_id_dict['tile_fetcher'].url_format)

    # context ={
    #   'trueColorTile':tile,
    # }

    # print(tile)
    
    return render(request, 'index.html' , {'context':  tiles})


def LST(sdate,edate, roi):
    sisdolImg = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR').filterBounds(roi).filterDate(sdate,edate).sort('CLOUD_COVER').first().clip(roi)


    #visualization
    vizParams = {
      'bands': ['B5', 'B6', 'B4'],
      'min': 0,
      'max': 4000,
      'gamma': [1, 0.9, 1.1]
    }

    vizTrueColor = {
      'bands': ['B4', 'B3', 'B2'],
      'min': 0,
      'max': 3000,
      'gamma': 1.4,
    }

    # true Color Tile URL
    true_map_id_dict = ee.Image(sisdolImg).getMapId(vizTrueColor)
    trueColorTileUrl = str(true_map_id_dict['tile_fetcher'].url_format) 

    #ndvi map
    ndvi = sisdolImg.normalizedDifference(['B5','B4']).rename('NDVI');
    ndviVizParams = {
      'min':-1,
      'max': 1,
      'palette' : ['blue','white','green']
    }

    ndvi_map_id_dict = ee.Image(ndvi).getMapId(ndviVizParams)
    ndviTileUrl = str(ndvi_map_id_dict['tile_fetcher'].url_format)


    #thermal band 10 (with brightness temperature), no calculation
    thermal = sisdolImg.select('B10').multiply(0.1)
    b10Params = {
      'min':291.918,
      'max':302.382,
      'palette': ['blue','white','green']
    }

    thermal_map_id_dict = ee.Image(thermal).getMapId(b10Params)
    thermalTileUrl = str(thermal_map_id_dict['tile_fetcher'].url_format)

    # #finding min and max of ndvi
    # ndviMin = ee.Number(ndvi.reduceRegion(
    #   reducer=ee.Reducer.min(),
    #   scale=30,
    #   maxPixels=1e9

    # ).values().get(0))
    # # ndviMin = ndvi.reduce(ee.Reducer.min())

    # ndviMax = ee.Number(ndvi.reduceRegion(
    #   reduce=ee.Reducer.max(),
    #   scale=30,
    #   maxPixels=1e9

    # ).values().get(0))

    # ndviMin = 0.09577114427860696
    # ndviMax = 0.9979317476732161
    #fractional vegetation

    # fv = (ndvi.subtract(ndviMin).divide(max.subtract(ndviMax))).pow(ee.Number(2)).rename('FV')

    # fv_map_id_dict = ee.Image(fv).getMapId(b10Params)
    # fvTileUrl = str(fv_map_id_dict['tile_fetcher'].url_format)

    # #emmissivity
    # a = ee.Number(0.004)
    # b = ee.Number(0.986)
    # EM = fv.multiply(a).add(b).rename('EMM')
    # EMVisParam = {
    #   'min': 0.9865619146722164,
    #   'max' : 0.989699971371314
    # }

    # em_map_id_dict = ee.Image(EM).getMapId(EMVisParam)
    # EMTileUrl = str(em_map_id_dict['tile_fetcher'].url_format)

    # #lst in celcius degree brings bring -273.15
    # #NB: in kelvin  don't bring -273.15
    # LST = thermal.expression('(Tb/(1 + (0.00115* (Tb / 1.438))*log(Ep)))-273.15',{
    #   'Tb': thermal.select('B10'),
    #   'Ep':EM.select('EMM')
    # }).rename('LST')

    # #min max LST
    # lstMin = ee.Number(LST.reduceRegion({
    #   'reducer':ee.Reducer.min(),
    #   'scale':30,
    #   'maxPixels':1e9
    # }).values().get(0))

    # lstMax = ee.Number(LST.reduceRegion({
    #   'reducer':ee.Reducer.max(),
    #   'scale':30,
    #   'maxPixels':1e9
    # }).values().get(0))

    # LSTVisParam = {
    #   'min':12.19726940544291,
    #   'max':41.6701111498399,
    #   'palette':['040274', '040281', '0502a3', '0502b8', '0502ce', '0502e6','0602ff', '235cb1', '307ef3', '269db1', '30c8e2', '32d3ef', '3be285', '3ff38f', '86e26f', '3ae237', 'b5e22e', 'd6e21f','fff705', 'ffd611', 'ffb613', 'ff8b13', 'ff6e08', 'ff500d','ff0000', 'de0101', 'c21301', 'a71001', '911003']
    # }

    # lst_map_id_dict = ee.Image(LST).getMapId(LSTVisParam)
    # LSTTileUrl = str(lst_map_id_dict['tile_fetcher'].url_format)


    context = {
      # 'LST' : LSTTileUrl,
      # 'Emissivity': EMTileUrl,
      # 'Fractional Vegetation': fvTileUrl,
      "Thermal": thermalTileUrl,
      "NDVI": ndviTileUrl,
      "TrueColor": trueColorTileUrl,
    }
    print(context)
    return context

