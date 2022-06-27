from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
import json
import ee

@api_view(['GET'])
def getBuildings(request):
    URL = 'https://api.ohsome.org/v1/elements/geometry'
    data = {"bboxes": "85.23073196411133, 27.79079494775251,85.2718448638916, 27.762621037146957", "time": "2019-09-01", "filter": "building=*"}
    response = requests.post(URL, data=data)
    buildings = response.json()
    buildingsJson = json.dumps(buildings)
    print(type(buildingsJson))
    return Response(buildings)


@api_view(['GET'])
def getTrueColor(request):
    roi = ee.Geometry.Polygon([
          [
            [
              85.22850036621094,
              27.83983506087852
            ],
            [
              85.33355712890625,
              27.83983506087852
            ],
            [
              85.33355712890625,
              27.91145753899194
            ],
            [
              85.22850036621094,
              27.91145753899194
            ],
            [
              85.22850036621094,
              27.83983506087852
            ]
          ]
        ])

    sisdol = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR').filterBounds(roi).filterDate('2020-01-01','2020-06-30').sort('CLOUD_COVER').first().clip(roi)
    # collection = ee.ImageCollection('COPERNICUS/S5P/NRTI/L3_CO').select('CO_column_number_density').filterDate('2020-01-01','2020-06-30').mean()
    vizParams2 = {
          'bands':['B4','B3','B2'],
          'min':0,
          'max':3000,
          'gamma':1.4
        };
    
    map_id_dict = ee.Image(sisdol).getMapId(vizParams2)
    tile = str(map_id_dict['tile_fetcher'].url_format)

    print(tile)
    tileData = {
      'layer' : 'True Color Imagery',
      'tile' : tile,
    }
    return Response(tileData)

