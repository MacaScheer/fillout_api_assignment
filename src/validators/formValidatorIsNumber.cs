const formInputIsNumber = (field) => {
    return body(field).isLength({min: 1}).isNumber();
}