import { getVertexShaderSource,getFragmentShaderSource } from "./shaders/testShader.js"

const degreeToRadian = (degree) => {
    const radian = degree * Math.PI / 180

    return radian
}

const cross = (a, b) => {
    return [
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2], 
        a[0]*b[1] - a[1]*b[0]
    ]
}

const dot = (a,b) => {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
    
}

const subtract = (a,b) => {
    return [
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2],
    ]
}

const normalize = (a) => {
    const length = Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2])

    if (length > 0.00001) {
        return [a[0]/length, a[1]/length, a[2]/length];
      } else {
        return [0, 0, 0];
      }
}

const matrix = {
    identity: () => [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    ],
    translate: (x=0, y=0, z=0) => {
        const m = matrix.identity()

        m[12] = x
        m[13] = y
        m[14] = z
        
        return m 
    },
    rotateX:(degree) => {
        const m = matrix.identity()
        const rad = degreeToRadian(degree)
        const c = Math.cos(rad)
        const s = Math.sin(rad)

        m[5] = c
        m[6] = s
        m[9] = -s
        m[10] = c

        return m
    },
    rotateY:(degree) => {
        const m = matrix.identity()
        const rad = degreeToRadian(degree)
        const c = Math.cos(rad)
        const s = Math.sin(rad)

        m[0] = c
        m[2] = s
        m[8] = -s
        m[10] = c

        return m
    },
    rotateZ:(degree) => {
        const m = matrix.identity()
        const rad = degreeToRadian(degree)

        const c = Math.cos(rad)
        const s = Math.sin(rad)

        m[0] = c
        m[1] = -s
        m[4] = s
        m[5] = c

        return m
    },
    scale:(scale) => {
        const m = matrix.identity()

        m[0] = scale
        m[5] = scale
        m[10] = scale

        return m
    },
    multiply: (a,b) => {
        const m = matrix.identity()

        const b00 = b[4 * 0 + 0]
        const b01 = b[4 * 0 + 1]
        const b02 = b[4 * 0 + 2]
        const b03 = b[4 * 0 + 3]
        const b10 = b[4 * 1 + 0]
        const b11 = b[4 * 1 + 1]
        const b12 = b[4 * 1 + 2]
        const b13 = b[4 * 1 + 3]
        const b20 = b[4 * 2 + 0]
        const b21 = b[4 * 2 + 1]
        const b22 = b[4 * 2 + 2]
        const b23 = b[4 * 2 + 3]
        const b30 = b[4 * 3 + 0]
        const b31 = b[4 * 3 + 1]
        const b32 = b[4 * 3 + 2]
        const b33 = b[4 * 3 + 3]

        const a00 = a[4 * 0 + 0]
        const a01 = a[4 * 0 + 1]
        const a02 = a[4 * 0 + 2]
        const a03 = a[4 * 0 + 3]
        const a10 = a[4 * 1 + 0]
        const a11 = a[4 * 1 + 1]
        const a12 = a[4 * 1 + 2]
        const a13 = a[4 * 1 + 3]
        const a20 = a[4 * 2 + 0]
        const a21 = a[4 * 2 + 1]
        const a22 = a[4 * 2 + 2]
        const a23 = a[4 * 2 + 3]
        const a30 = a[4 * 3 + 0]
        const a31 = a[4 * 3 + 1]
        const a32 = a[4 * 3 + 2]
        const a33 = a[4 * 3 + 3]

        m[0] = b00*a00 + b01*a10 + b02*a20 + b03*a30
        m[1] = b00*a01 + b01*a11 + b02*a21 + b03*a31
        m[2] = b00*a02 + b01*a12 + b02*a22 + b03*a32
        m[3] = b00*a03 + b01*a13 + b02*a23 + b03*a33
        m[4] = b10*a00 + b11*a10 + b12*a20 + b13*a30
        m[5] = b10*a01 + b11*a11 + b12*a21 + b13*a31
        m[6] = b10*a02 + b11*a12 + b12*a22 + b13*a32
        m[7] = b10*a03 + b11*a13 + b12*a23 + b13*a33
        m[8] = b20*a00 + b21*a10 + b22*a20 + b23*a30
        m[9] = b20*a01 + b21*a11 + b22*a21 + b23*a31
        m[10] = b20*a02 + b21*a12 + b22*a22 + b23*a32
        m[11] = b20*a03 + b21*a13 + b22*a23 + b23*a33
        m[12] = b30*a00 + b31*a10 + b32*a20 + b33*a30
        m[13] = b30*a01 + b31*a11 + b32*a21 + b33*a31
        m[14] = b30*a02 + b31*a12 + b32*a22 + b33*a32
        m[15] = b30*a03 + b31*a13 + b32*a23 + b33*a33

        return m
    },
    inverse: (m) => {
        var m00 = m[0 * 4 + 0];
        var m01 = m[0 * 4 + 1];
        var m02 = m[0 * 4 + 2];
        var m03 = m[0 * 4 + 3];
        var m10 = m[1 * 4 + 0];
        var m11 = m[1 * 4 + 1];
        var m12 = m[1 * 4 + 2];
        var m13 = m[1 * 4 + 3];
        var m20 = m[2 * 4 + 0];
        var m21 = m[2 * 4 + 1];
        var m22 = m[2 * 4 + 2];
        var m23 = m[2 * 4 + 3];
        var m30 = m[3 * 4 + 0];
        var m31 = m[3 * 4 + 1];
        var m32 = m[3 * 4 + 2];
        var m33 = m[3 * 4 + 3];
        var tmp_0  = m22 * m33;
        var tmp_1  = m32 * m23;
        var tmp_2  = m12 * m33;
        var tmp_3  = m32 * m13;
        var tmp_4  = m12 * m23;
        var tmp_5  = m22 * m13;
        var tmp_6  = m02 * m33;
        var tmp_7  = m32 * m03;
        var tmp_8  = m02 * m23;
        var tmp_9  = m22 * m03;
        var tmp_10 = m02 * m13;
        var tmp_11 = m12 * m03;
        var tmp_12 = m20 * m31;
        var tmp_13 = m30 * m21;
        var tmp_14 = m10 * m31;
        var tmp_15 = m30 * m11;
        var tmp_16 = m10 * m21;
        var tmp_17 = m20 * m11;
        var tmp_18 = m00 * m31;
        var tmp_19 = m30 * m01;
        var tmp_20 = m00 * m21;
        var tmp_21 = m20 * m01;
        var tmp_22 = m00 * m11;
        var tmp_23 = m10 * m01;
    
        var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
    
        var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
        
        if ((m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3) === 0) return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        return [
          d * t0,
          d * t1,
          d * t2,
          d * t3,
          d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
          d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
          d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
          d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
          d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
          d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
          d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
          d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
          d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
          d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
          d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
          d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ];
    },
    lookAt: (pos, target, up) => {       
        
        const z = normalize(subtract(pos,target))
        const x = normalize(cross(up,z))
        const y = normalize(cross(z,x))

    return [
        x[0], x[1], x[2], 0,
        y[0], y[1], y[2], 0,
        z[0], z[1], z[2], 0,
        pos[0], pos[1], pos[2], 1
    ]


    },
    perspective: (fov, aspectRatio, near, far) => {
        const fovRad = degreeToRadian(fov)
        const focalLength = 1 / Math.tan(fovRad*0.5)

        return [
            focalLength/aspectRatio, 0, 0, 0,
            0, focalLength, 0, 0,
            0, 0, (near + far) / (near - far), -1,
            0, 0, (2 * near * far) / (near - far), 0
        ]
    },
    orthograpic: (l, r, t, b, n, f) => {
        return [
            2/(r-l), 0, 0, 0,
            0, 2/(t-b), 0, 0,
            0, 0, 2/(f-n), 0,
            -(r+l)/(r-l), -(t+b)/(t-b), (f+n)/(f-n),1
        ]
    }, 
    transpose: (m) => {
        return [
            m[0], m[4] , m[8], m[12],
            m[1], m[5] , m[9], m[13],
            m[2], m[6] , m[10], m[14],
            m[3], m[7] , m[11], m[15],
        ]
    }
}

function main() {
    const canvas = document.querySelector('#webgl')
    const gl = canvas.getContext('webgl')
    
    if (!gl) {
        throw new Error('Cannot run webgl')
    }
    
    gl.canvas.width = gl.canvas.clientWidth
    gl.canvas.height = gl.canvas.clientHeight

    gl.viewport(0,0,gl.canvas.width, gl.canvas.height)

    const normals = [
        //front
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1,
        // back
        0,0,-1,
        0,0,-1,
        0,0,-1,
        0,0,-1,
        0,0,-1,
        0,0,-1,
        // left
        -1,0,0,
        -1,0,0,
        -1,0,0,
        -1,0,0,
        -1,0,0,
        -1,0,0,
        // right
        1,0,0,
        1,0,0,
        1,0,0,
        1,0,0,
        1,0,0,
        1,0,0,
        // top
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0,
        // bottom
        0,-1,0,
        0,-1,0,
        0,-1,0,
        0,-1,0,
        0,-1,0,
        0,-1,0,
    ]

    const colors = [
        0.9,0.7,0,1,
        0.9,0.7,0,1,
        0.9,0.7,0,1,
        0.9,0.7,0,1,
        0.9,0.7,0,1,
        0.9,0.7,0,1,

        0,0.7,0.1,1,
        0,0.7,0.1,1,
        0,0.7,0.1,1,
        0,0.7,0.1,1,
        0,0.7,0.1,1,
        0,0.7,0.1,1,

        0,0.9,0.8,1,
        0,0.9,0.8,1,
        0,0.9,0.8,1,
        0,0.9,0.8,1,
        0,0.9,0.8,1,
        0,0.9,0.8,1,

        0.8,0.1,0,1,
        0.8,0.1,0,1,
        0.8,0.1,0,1,
        0.8,0.1,0,1,
        0.8,0.1,0,1,
        0.8,0.1,0,1,

        0,0.1,0.9,1,
        0,0.1,0.9,1,
        0,0.1,0.9,1,
        0,0.1,0.9,1,
        0,0.1,0.9,1,
        0,0.1,0.9,1,

        0.9,0.1,0.9,1,
        0.9,0.1,0.9,1,
        0.9,0.1,0.9,1,
        0.9,0.1,0.9,1,
        0.9,0.1,0.9,1,
        0.9,0.1,0.9,1,
    ]

    const positions = [
        // front
        -50, 50, 50,
        -50, -50, 50,
         50, 50, 50,
         50, 50, 50,
         -50, -50, 50,
         50, -50, 50,

        // back
        -50, -50, -50,
        -50, 50, -50,
         50, 50, -50,
         50, 50, -50,
         50, -50, -50,
         -50, -50, -50,
         
        // left
        -50, 50, -50,
        -50, -50, -50,
        -50, 50, 50,
        -50, 50, 50,
        -50, -50, -50,
        -50, -50, 50,

        // right
        50, 50, 50,
        50, -50, 50,
         50, 50, -50,
         50, 50, -50,
         50, -50, 50,
         50, -50, -50,

          // top
          -50, 50, -50,
          -50, 50, 50,
          50, 50, -50,
          50, 50, -50,
          -50, 50, 50,
          50, 50, 50,

           // bottom
           -50, -50, -50,
           50, -50, -50,
           -50, -50, 50,
           50, -50, -50,
           50, -50, 50,
           -50, -50, 50,
    ]


    const getBuffer = (target, vertex, usage) => {
        const buffer = gl.createBuffer()
        gl.bindBuffer(target, buffer)
        gl.bufferData(target, vertex, usage)

        gl.bindBuffer(target, null)

        return buffer
    }

    const getShader = (vertexShaderSource, fragmentShaderSource) => {
        const vertexShader = gl.createShader(gl.VERTEX_SHADER)
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

        gl.shaderSource(vertexShader, vertexShaderSource)
        gl.shaderSource(fragmentShader, fragmentShaderSource)

        gl.compileShader(vertexShader)
        gl.compileShader(fragmentShader)

        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            throw new Error("Failed Compile vertexShader")
        }

        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            throw new Error("Failed Compile fragmentShader")
        }

        return {vertexShader, fragmentShader}
    }

    const getProgram = (vertexShader, fragmentShader) => {
        const program = gl.createProgram()

        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)

        gl.linkProgram(program)

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error("Failed Link Program")
        }

        return program
    }

    const getProgramInfo = () => {
        const attributes = {}
        const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
        for (let i = 0; i < attributeCount; i++) {
            const info = gl.getActiveAttrib(program, i)
        
            if (!info) break;

            attributes[info.name] = gl.getAttribLocation(program, info.name)
        }

        const uniforms = {}
        const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
        for (let i = 0; i < uniformCount; i++) {
            const info = gl.getActiveUniform(program, i) 

            if (!info) return

            uniforms[info.name] = gl.getUniformLocation(program, info.name)
        }

        console.log(attributes, uniforms)
        return {attributes,uniforms}
    }

    const setProgramInfo = (attributes) => {
        let size = 0
        const type = gl.FLOAT
        const normalized = false
        const stride = 0
        const offset = 0

        for (const key in attributes) {
            const location = attributes[key]
            
            if (location === attributes.aPosition) {
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
                size = 3
            } else if (location === attributes.aColor) {
                gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
                size = 4
            } else if (location === attributes.aNormal) {
                gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
                size = 3
            }
            
            gl.enableVertexAttribArray(location)
            gl.vertexAttribPointer(location, location === 1 ? 4 : size, type, normalized, stride, offset)
        }
    }
    

    const positionBuffer = getBuffer(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    const colorBuffer = getBuffer(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
    const normalBuffer = getBuffer(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)
    const {vertexShader, fragmentShader} = getShader(getVertexShaderSource(), getFragmentShaderSource())
    const program = getProgram(vertexShader, fragmentShader)
    const {attributes, uniforms} = getProgramInfo()

    setProgramInfo(attributes)
    gl.useProgram(program)

 
    //let pm = matrix.orthograpic(0,gl.canvas.clientWidth, 0, gl.canvas.clientHeight, -100, 100)
    let pm = matrix.perspective(75, gl.canvas.clientWidth / gl.canvas.clientHeight, 10, 2000)

    const cPos = [0,0,300]
    const target = [0,0,0]
    const up = [0,1,0]
    let cm = matrix.lookAt(cPos, target, up)

    // cm = matrix.multiply(matrix.translate(0,0,0),matrix.rotateY(10))
    let vm = matrix.inverse(cm)
    
    //vm = matrix.multiply(vm, matrix.translate(50,0,0))

     let m = matrix.identity()
     //m = matrix.multiply(m, matrix.translate(0,0,-30))
   
    // let vpm = matrix.multiply(pm,vm)

    // for (const key in uniforms) {
    //     const location = uniforms[key]
       
    //     gl.uniformMatrix4fv(location, false,m)
    // }

    gl.uniform3fv(uniforms.uLightPos,[0,30.,200.])
    gl.uniform3fv(uniforms.eyePos, [50.,0,200.])
    gl.uniform1f(uniforms.uShininess, 100.)
    gl.uniform1f(uniforms.uLimit, Math.cos(degreeToRadian(10)))
    gl.uniform3fv(uniforms.uLightDirection, normalize([0,-30.,-200.]))
    gl.uniform3fv(uniforms.uAmbientLight, [0.1,0.1,0.1])

    let prev = 0

    function loop(time) {
        const now = Date.now()
        const deltaTime = (now - prev)*0.1
        prev = now

        gl.clearColor(0.0,0.0,0.0,1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.clear(gl.DEPTH_BUFFER_BIT)

        gl.enable(gl.CULL_FACE)
        gl.enable(gl.DEPTH_TEST)
    
        m = matrix.multiply(m, matrix.rotateY(0.1))
        const witm = matrix.transpose(matrix.inverse(m))
        gl.uniformMatrix4fv(uniforms.worldInverseTransposeMatrix, false, witm)
        gl.uniformMatrix4fv(uniforms.transformMatrix, false, m)
        gl.uniformMatrix4fv(uniforms.viewMatrix, false, vm)
        gl.uniformMatrix4fv(uniforms.projectionMatrix, false, pm)
       
        gl.drawArrays(gl.TRIANGLES, 0, 6 * 6)

        requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)

}

main()








