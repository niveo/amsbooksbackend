interface String {
  toBoolean(): boolean;
}

String.prototype.toBoolean = function () {
  const value = this.toString().toLowerCase();
  return value === 'true' || value == '1';
};
