import * as THREE from "https://unpkg.com/three@0.119.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js";

const SceneFactory = ( function () {

	function SceneFactory() {
    this.camera=null;
    this.scene=null;
    this.renderer=null;
    this.controls=null;
	}

	SceneFactory.prototype = {

		constructor: SceneFactory,

		createScene: function ( container, callback, options ) {

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x444444);

        if(options.camera){
          this.camera = options.camera;
          
        }else {
          this.camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            30
          );
          this.camera.position.set(-3.5, 3.6, 5.3);
        }
      
        this.controls = new OrbitControls(this.camera, container);
        //this.controls.minDistance = 1;
        //this.controls.maxDistance = 6;
        this.controls.target.set(0, 1.3, 0);
        this.controls.update();   
      
        var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1 );
        directionalLight.position.set( 100, 350, 250 );
        directionalLight.castShadow = true;
        this.scene.add( directionalLight );
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
				this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.xr.enabled = true;
      
        if(callback){
          callback(this.scene);
        }
		} 

	}

	return SceneFactory;

} )();


export { SceneFactory };