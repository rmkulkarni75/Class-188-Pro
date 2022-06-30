const fragmentSinColor = `
    // Use medium precision.
    //precision mediump float;


    uniform float u_time;
    uniform float timeMsec; // A-Frame time in milliseconds.
    varying vec3 vNormal;
    varying float ao;

    float c( float oc ) {
        return max(min(abs(sin(3.14*oc*0.1)),0.5),0.1);
    }

    void main() {
        float diffuse_value1 = .0015 * max(dot(vNormal, vec3( -490.0, 29.8, -85.8 ) ), 0.0);
        float diffuse_value2 = .0005 * max(dot(vNormal, vec3( -460.0, 40.27, 187.4 ) ), 0.0);
        float diffuse_value3 = .0010 * max(dot(vNormal, vec3( 175.5, 30.04, 466.4 ) ), 0.0);
        float diffuse_value4 = .0005 * max(dot(vNormal, vec3( 466.0, 45.3, 172.9 ) ), 0.0); 

        vec3 color = vec3(0.);
        color = vec3( c(timeMsec*0.005), c(timeMsec*0.001), c(timeMsec*0.0005)  );
        gl_FragColor = vec4( color - .15 * ao + .5 * vec3( diffuse_value1 + diffuse_value2 + diffuse_value3 + diffuse_value4 ), 1.0 );            
    }

`;