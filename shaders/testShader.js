export const getVertexShaderSource = () => {
    return  `
    attribute vec3 aPosition;
    attribute vec4 aColor;
    attribute vec3 aNormal;

    uniform mat4 transformMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat4 viewProjectionMatrix;
    uniform mat4 worldInverseTransposeMatrix;
    uniform vec3 uLightPos;
    uniform vec3 eyePos;

    varying vec4 vColor;
    varying vec3 vNormal;
    varying vec3 vSurfaceToLight;
    varying vec3 vSurfaceToEye;
    varying vec3 vLightPos;
    
    void main() {
        vec4 position = projectionMatrix * viewMatrix * transformMatrix * vec4(aPosition, 1.0);

        vColor = aColor;
        vLightPos = uLightPos;

        vNormal = (worldInverseTransposeMatrix * vec4(aNormal, 0)).xyz;
        vec3 surfaceToWorldPos = (transformMatrix * vec4(aPosition, 1.0)).xyz;
        vSurfaceToLight = uLightPos - surfaceToWorldPos;
        vSurfaceToEye = eyePos - surfaceToWorldPos;

        gl_Position = position;
    }
    `
}

// phong reflection = ambient + diffuse + specular

export const getFragmentShaderSource = () => {
    return `
    precision mediump float;

    uniform vec3 uAmbientLight;

    varying vec3 vLightPos;
    varying vec4 vColor;
    varying vec3 vNormal;
    varying vec3 vSurfaceToLight;
    varying vec3 vSurfaceToEye;

    const float constantAtt = 1.0;
    const float linearAtt = 0.1;
    const float quadraticAtt = 0.01;
    
    void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightPos = normalize(vLightPos);
        vec3 surfaceToLight = normalize(vSurfaceToLight);
        vec3 surfaceToEye = normalize(vSurfaceToEye);
        
        float d = length(surfaceToLight);

        float diffuse = clamp(dot(lightPos, normal),0.0,1.0);
        diffuse *= 1.0 / (constantAtt + (linearAtt * d + quadraticAtt * d * d));

        vec3 reflectVector = normalize((2. * dot(vSurfaceToLight, normal) * normal) - vSurfaceToEye);
        //reflectVector = normalize(reflect(-vSurfaceToLight, normal));
        
        float specular = pow(clamp(dot(reflectVector, surfaceToEye),0.0,1.0), 10.0);
        
        vec3 col = vColor.rgb * (uAmbientLight + diffuse + specular);
        gl_FragColor = vec4(col, 1.0);
    }    
    `
}

// // spot light

// export const getFragmentShaderSource = () => {
//     return `
//     precision mediump float;

//     uniform float uShininess;
//     uniform float uLimit;
//     uniform vec3 uLightDirection;

//     varying vec4 vColor;
//     varying vec3 vNormal;
//     varying vec3 vSurfaceToLight;
//     varying vec3 vSurfaceToEye;

//     void main() {
//         vec3 normal = normalize(vNormal);
//         vec3 lightPos = normalize(vSurfaceToLight);
//         vec3 eyePos = normalize(vSurfaceToEye);
//         vec3 halfVec = normalize(lightPos + eyePos);
    
//         float light = 0.1;
//         float specular = 0.0;

//         float dotFromDirection = dot(lightPos, -uLightDirection);

//         float inLight = smoothstep(uLimit, uLimit+0.01, dotFromDirection)+0.2;

//         light  = inLight * dot(normal, lightPos);
//         specular = inLight * pow(dot(normal, halfVec), uShininess);

//         // if (dotFromDirection >= uLimit) {
//         //     light = dot(normal, lightPos);
            
//         //     if (light > 0.0) {
//         //         specular = pow(dot(normal, halfVec), uShininess);
//         //     }
//         // }
        
//         vec3 col = vColor.rgb * light;
//         col += specular;
//         gl_FragColor = vec4(col, 1.0);
//     }    
//     `
// }

// point light

// export const getFragmentShaderSource = () => {
//     return `
//     precision mediump float;

//     uniform float uShininess;

//     varying vec4 vColor;
//     varying vec3 vNormal;
//     varying vec3 vSurfaceToLight;
//     varying vec3 vSurfaceToEye;

//     void main() {
//         vec3 normal = normalize(vNormal);
//         vec3 lightPos = normalize(vSurfaceToLight);
//         vec3 eyePos = normalize(vSurfaceToEye);
//         vec3 halfVec = normalize(lightPos + eyePos);
    
//         float diffuse = dot(lightPos,normal);
//         float specular = dot(halfVec, normal);
//         specular = clamp(pow(specular, uShininess), 0.0, 1.0);

        
//         vec3 col = vColor.rgb * diffuse;
//         col += specular;
//         gl_FragColor = vec4(col, 1.0);
//     }    
//     `
// }

// directional light 

// export const getFragmentShaderSource = () => {
//     return `
//     precision mediump float;

//     varying vec4 vColor;
//     varying vec3 vNormal;
    
//     void main() {
//         vec3 normal = normalize(vNormal);
//         vec3 lightPos = vec3(0, 1,-2);
//         lightPos = normalize(lightPos);

//         float diffuse = dot(lightPos,normal) + 0.2;
        
//         vec3 col = vColor.rgb * diffuse;
//         gl_FragColor = vec4(col, 1.0);
//     }    
//     `
// }