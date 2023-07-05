#!/usr/bin/env python
import json
import os
import sys

import netCDF4
import numpy as np


def getRanges(data_dir):
	ranges = {}
	for basin in os.listdir(os.path.join(data_dir, 'nc')):
		for root, dirs, files in os.walk(os.path.join(data_dir, 'nc', basin)):
			for file in files:
				if file.endswith('.nc'):
					nc_file = netCDF4.Dataset(os.path.join(root, file))
					variables = nc_file.variables.keys()

					for variable in variables:
						if basin not in ranges:
							ranges[basin] = {}
						if variable not in ranges[basin]:
							ranges[basin][variable] = [float('inf'), float('-inf')]

						data = nc_file.variables[variable][:]
						np.copyto(data, np.nan, where=(data == -9999))
						np.copyto(data, np.nan, where=(data == 9999))

						low = np.nanmin(data)
						high = np.nanmax(data)

						if low < ranges[basin][variable][0]:
							ranges[basin][variable][0] = low
						if high > ranges[basin][variable][1]:
							ranges[basin][variable][1] = high

	return ranges
