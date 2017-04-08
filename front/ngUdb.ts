import * as angular from "angular";
import {UdbService} from "./UdbService";
import {UdbController} from "./UdbController";
import {Logger} from "../log";
import {WebFileInput} from "./WebFileInput";

angular.module('ngUdb', [])
  .constant('DEBUG', false)
  .constant('verbose', true)
  .service('udbService', UdbService)
  .service('logger', Logger)
  .service('webFileInput', WebFileInput)
  .controller('UdbController', UdbController);