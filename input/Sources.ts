export class Sources {
  primaryReferences = {};
  newspapersAndFootnotes = {};
  otherDatabasesAndWebsites = {};
  otherPeriodicals = {};
  misc = {};
  discredited = [];

  addDiscredited(line) {
    this.discredited.push(line.substring(2));
  }

  addSource(arr, line) {
    const ref = parseInt(line.substring(1, 4), 0);
    arr[ref] = line.substring(5);
  }

  open(sourcesReader, cb) {
    sourcesReader
      .on('line', (line) => {
        switch (line.charAt(0)) {
          case '/':
            this.addSource(this.primaryReferences, line);
            break;
          case '$':
            this.addSource(this.newspapersAndFootnotes, line);
            break;
          case '+':
            this.addSource(this.otherDatabasesAndWebsites, line);
            break;
          case '%':
            this.addSource(this.otherPeriodicals, line);
            break;
          case '#':
            this.addSource(this.misc, line);
            break;
          case '!':
            this.addDiscredited(line);
            break;
        }
      })
      .on('close', cb);
  }
}

