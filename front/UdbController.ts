export class UdbController {

  private matchCriteria: string;
  private matchResults = [];

  constructor(private udbService) {
    this.matchCriteria = 'year=1972&month=8';
  }

  search() {
    this.matchResults = this.udbService.match(this.matchCriteria).records;
  }
}