export interface Output<R> {

  write(object: R)
}

export interface RecordOutput<R> {

  write(record: R)

  end();
}
