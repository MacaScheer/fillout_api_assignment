const formInputIsString = () => {
    return body(field).trim().isString().isLength({min: 1});
}