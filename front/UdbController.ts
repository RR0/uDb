import {WebLogger} from "./WebLogger";

export class UdbController {

  private matchCriteria: string;
  private matchResults = [];
  private logs = '';

  constructor($scope, private udbService, logger: WebLogger) {
    this.matchCriteria = '';
    logger.subscribe(msg => {
      $scope.$applyAsync(() => {
        this.logs += msg;
      });
    });
    $scope.$applyAsync(() => {
      udbService.load('./U.RND');
    });
  }

  search() {
    this.matchResults = this.udbService.match(this.matchCriteria).records;
  }
}