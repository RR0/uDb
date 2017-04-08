import * as angular from "angular";
import {UdbService} from "./UdbService";
import {UdbController} from "./UdbController";
import {WebFileInput} from "./WebFileInput";
import {WebLogger} from "./WebLogger";

angular.module('rr0')
  .constant('DEBUG', false)
  .constant('verbose', true)
  .service('udbService', UdbService)
  .service('logger', WebLogger)
  .service('webFileInput', WebFileInput)
  .controller('UdbController', UdbController);