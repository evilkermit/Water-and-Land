import netCDF4

def getVariableNames(path):
    usableVariables = []

    f = netCDF4.Dataset(path)
    variables = f.variables.keys()
    for var in variables:
        dimensions = f.variables[var].get_dims()
        if dimensions[0].name == 'time' and dimensions[1].name == 'longitude' and dimensions[2].name == 'latitude':
            usableVariables.append(var)

    return usableVariables
