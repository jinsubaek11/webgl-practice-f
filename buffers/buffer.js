
export class Buffer {

    constructor(elementSize, dataType=gl.FLOAT, targetBufferType=gl.ARRAY_BUFFER, mode=gl.TRIANGLES) {
        this._elementSize = elementSize
        this._dataType = dataType
        this._targetBufferType = targetBufferType
        this._mode = mode

        switch(this._dataType) {
            case gl.FLOAT:
            case gl.INT:
            case gl.UNSIGNED_INT:
                this._typeSize = 4
                break;
            case gl.SHORT:
            case gl.UNSIGNED_SHORT:
                this._typeSize = 2
                break;
            case gl.BYTE:
            case gl.UNSIGNED_BYTE:
                this._typeSize = 1   
                break;
            default: 
                throw new Error(`Unrecognize dataType ${dataType}`) 
                
        }
        this._stride = this._elementSize * this._typeSize
        this._buffer = gl.createBuffer()
    }

    destroy() {

    }

    bind() {
        gl.bindBuffer(this._targetBufferType, this._buffer)
    }

    unbind() {

    }

    upload() {

    }

    draw() {

    }

}
