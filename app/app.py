from flask import Flask, request, render_template, send_file, jsonify
from grapher import *
from io import BytesIO
import json
import os
import tempfile

import matplotlib.pyplot as plt
import netCDF4


app = Flask(__name__)

dataloc = os.path.join('/data/')

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/getBasins/', methods=['GET'])
def getBasins():
    basins = []
    for file in os.listdir(dataloc):
        basins.append(file)

    basins.sort()
    return jsonify(basins)

@app.route('/getScenarios/', methods=['GET'])
def getScenarios():
    basin = request.args.get('basin')

    scenarios = []
    for file in os.listdir(os.path.join(dataloc, basin)):
        scenarios.append(os.path.splitext(file)[0])

    scenarios.sort()
    return jsonify(scenarios)

@app.route('/getVariables/', methods=['GET'])
def getVariables():
    basin = request.args.get('basin')
    scenario = request.args.get('scenario')

    basin_path = os.path.join(dataloc, basin, scenario)
    nc_filename = os.listdir(basin_path)[0] # TODO: this makes the assumption that each scenario/basin has a single file, which may not be valid at some point
    nc_file = netCDF4.Dataset(os.path.join(basin_path, nc_filename))

    usable_variables = []
    variables = nc_file.variables.keys()
    for var in variables:
        dimensions = nc_file.variables[var].get_dims()
        if dimensions[0].name == 'time' and dimensions[1].name == 'longitude' and dimensions[2].name == 'latitude':
            usable_variables.append(var)

    usable_variables.sort()
    return jsonify(usable_variables)

@app.route('/render/', methods=['POST'])
def render():
    body = request.get_json()

    basin = body['basin']
    date = body['date']
    hour = body['hour']
    scenario =  body['scenario']
    variable =  body['variable']

    date_parts = str(date).split('-')
    date = date_parts[1]
    date += '/'
    date += date_parts[2]
    date += '/'
    date += date_parts[0]

    fig = graph(basin, scenario, variable, date, hour)

    image_data = BytesIO()

    fig.set_dpi(300)
    fig.set_size_inches(4.5, 4.1)
    fig.savefig(image_data, format='png')
    plt.close(fig)

    image_data.seek(0)

    return send_file(image_data, mimetype='image/png')

# TODO: what is the point of this?
@app.route('/data/', methods=['POST'])
def get_data():
    body = request.get_json()

    ncpath = body['ncpath']
    variable =  body['variable']
    date = body['date']
    hour = body['hour']

    numpy_arr = get_numpy(dataloc + ncpath + '.nc', variable, date, hour)

    return jsonify(numpy_arr.tolist())

if __name__ == '__main__':
    app.run(host='0.0.0.0')
