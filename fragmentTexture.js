// Requires:
//      uMap: uniform sampler2D uMap with texture
//      vNormal : normal vector from vertex shader
//      vUV : uv vector from vertex shader
//      ao : weighting float from vertex shader

const fragmentTexture = `
    // Use medium precision.
    //precision mediump float;

    varying vec3 vNormal;
    varying float ao;
    uniform sampler2D uMap;
    varying vec2 vUV;

    void main() {
        float diffuse_value1 = .0015 * max(dot(vNormal, vec3( -490.0, 29.8, -85.8 ) ), 0.0);
        float diffuse_value2 = .0005 * max(dot(vNormal, vec3( -460.0, 40.27, 187.4 ) ), 0.0);
        float diffuse_value3 = .0010 * max(dot(vNormal, vec3( 175.5, 30.04, 466.4 ) ), 0.0);
        float diffuse_value4 = .0005 * max(dot(vNormal, vec3( 466.0, 45.3, 172.9 ) ), 0.0); 

        vec4 t = texture2D(uMap, vec2(vUV.x, vUV.y));
        vec3 c = vec3(t);
        gl_FragColor = vec4( c - .15 * ao + .5 * vec3( diffuse_value1 + diffuse_value2 + diffuse_value3 + diffuse_value4 ), 1.0 );            
    }
`;
