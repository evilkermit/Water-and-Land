#!/usr/bin/env python
import json
import os
import sys

import netCDF4
import numpy as np


def getRanges(data_dir):
	ranges = {}
	for root, dirs, files in os.walk(os.path.join(data_dir, 'nc')):
		for file in files:
			if file.endswith('.nc'):
				nc_file = netCDF4.Dataset(os.path.join(root, file))
				variables = nc_file.variables.keys()

				for variable in variables:
					if variable not in ranges:
						ranges[variable] = [float('inf'), float('-inf')]

					data = nc_file.variables[variable][:]
					np.copyto(data, np.nan, where=(data == -9999))
					np.copyto(data, np.nan, where=(data == 9999))

					low = np.nanmin(data)
					high = np.nanmax(data)

					if low < ranges[variable][0]:
						ranges[variable][0] = low
					if high > ranges[variable][1]:
						ranges[variable][1] = high

	print(ranges)
	return ranges
