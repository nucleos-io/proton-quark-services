'use strict'

let path = require('path')
let Quark = require('proton-quark')
let _ = require('lodash')

/**
 * @class ServicesQuark
 * @classdesc This quark is for instance services
 * @author Luis Hernandez
 */
class ServicesQuark extends Quark {

  constructor(proton) {
    super(proton)
  }

  /**
   * @override
   * @method configure
   * @description Ask if the proton.app.services object exist, if not exist
   * the method create the proton.app.services object
   * @author Luis Hernandez
   */
  configure() {
    return new Promise(resolve => {
      if (!this.proton.app.services) this.proton.app.services = {}
      resolve()
    })
  }

  /**
   * @override
   * @method initialize
   * @description instance all models of the app
   * @author Luis Hernandez
   */
  initialize() {
    return new Promise(resolve => {
      _.forEach(this._services, (Service, fileName) => {
        const service = new Service(this.proton)
        service.fileName = fileName
        this._addServiceToApp(service)
        return service
      })
      resolve()
    })
  }

  _addServiceToApp(service) {
    this.proton.app.services[service.name] = service
  }

  /**
   * @method services
   * @description This method get the export value of each service present
   * in the services folder
   * @author Luis Hernandez
   * @return {Array} - All services exported values as an array
   */
  get _services() {
    const modelsPath = path.join(this.proton.app.path, '/api/services')
    return require('require-all')(modelsPath)
  }

  get name() {
    return 'proton-quark-services'
  }

}

module.exports = ServicesQuark
