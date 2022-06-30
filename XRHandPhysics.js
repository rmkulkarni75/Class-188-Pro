import * as THREE from "https://unpkg.com/three@0.119.1/build/three.module.js";

class XRHandPhysics {

  constructor(){
    this.bonesMapping = [
      'b_%_wrist', // XRHand.WRIST,

      'b_%_thumb1', // XRHand.THUMB_METACARPAL,
      'b_%_thumb2', // XRHand.THUMB_PHALANX_PROXIMAL,
      'b_%_thumb3', // XRHand.THUMB_PHALANX_DISTAL,
      'b_%_thumb_null', // XRHand.THUMB_PHALANX_TIP,

      null, //'b_%_index1', // XRHand.INDEX_METACARPAL,
      'b_%_index1', // XRHand.INDEX_PHALANX_PROXIMAL,
      'b_%_index2', // XRHand.INDEX_PHALANX_INTERMEDIATE,
      'b_%_index3', // XRHand.INDEX_PHALANX_DISTAL,
      'b_%_index_null', // XRHand.INDEX_PHALANX_TIP,

      null, //'b_%_middle1', // XRHand.MIDDLE_METACARPAL,
      'b_%_middle1', // XRHand.MIDDLE_PHALANX_PROXIMAL,
      'b_%_middle2', // XRHand.MIDDLE_PHALANX_INTERMEDIATE,
      'b_%_middle3', // XRHand.MIDDLE_PHALANX_DISTAL,
      'b_%_middlenull', // XRHand.MIDDLE_PHALANX_TIP,

      null, //'b_%_ring1', // XRHand.RING_METACARPAL,
      'b_%_ring1', // XRHand.RING_PHALANX_PROXIMAL,
      'b_%_ring2', // XRHand.RING_PHALANX_INTERMEDIATE,
      'b_%_ring3', // XRHand.RING_PHALANX_DISTAL,
      'b_%_ring_inull', // XRHand.RING_PHALANX_TIP,

      'b_%_pinky0', // XRHand.LITTLE_METACARPAL,
      'b_%_pinky1', // XRHand.LITTLE_PHALANX_PROXIMAL,
      'b_%_pinky2', // XRHand.LITTLE_PHALANX_INTERMEDIATE,
      'b_%_pinky3', // XRHand.LITTLE_PHALANX_DISTAL,
      'b_%_pinkynull', // XRHand.LITTLE_PHALANX_TIP
    ];
  }

  initWithHands( lHand, rHand, physics, scene ) {

    this.lHand = lHand;
    this.rHand = rHand;
    this.physics = physics;
    this.scene = scene;
    this.lBones = [];
    this.rBones = [];
    this.lMeshes = [];
    this.rMeshes = [];
    this.lBoneGroup = new THREE.Group();
    this.rBoneGroup = new THREE.Group();
    
    this.bonesMapping.forEach( boneName => {

      if ( boneName ) {
        var b = this.setupHandBone(this.lHand, 'l', boneName, this.lBones, this.lMeshes);
        if(b){
          this.lBoneGroup.add(b);
        }
        
        b = this.setupHandBone(this.rHand, 'r', boneName, this.rBones, this.rMeshes);
        if(b){
          this.rBoneGroup.add(b);
        }
      
      } 

    } );

    this.scene.add(this.rBoneGroup);
    this.physics.addMesh(this.rBoneGroup, 0);
    
    this.scene.add(this.lBoneGroup);
    this.physics.addMesh(this.lBoneGroup, 0);
  }
  
  update(){
    var q = new THREE.Quaternion();
    this.updateHand(this.lHand, this.lBones, this.lMeshes);  
    this.updateHand(this.rHand, this.rBones, this.rMeshes);
    
    this.rBoneGroup.position.x = this.rHand.position.x;
    this.rBoneGroup.position.y = this.rHand.position.y;
    this.rBoneGroup.position.z = this.rHand.position.z;
    this.rBoneGroup.rotation.z = this.rHand.rotation.z;
    this.rBoneGroup.rotation.y = this.rHand.rotation.y;
    this.rBoneGroup.rotation.x = this.rHand.rotation.x;
    q.setFromEuler(this.rBoneGroup.rotation);
    this.physics.setMeshQuaternion(this.rBoneGroup, q);    
    this.physics.setMeshPosition(this.rBoneGroup, this.rBoneGroup.position);

    this.lBoneGroup.position.x = this.lHand.position.x;
    this.lBoneGroup.position.y = this.lHand.position.y;
    this.lBoneGroup.position.z = this.lHand.position.z;
    this.lBoneGroup.rotation.z = this.lHand.rotation.z;
    this.lBoneGroup.rotation.y = this.lHand.rotation.y;
    this.lBoneGroup.rotation.x = this.lHand.rotation.x;
    q.setFromEuler(this.lBoneGroup.rotation);
    this.physics.setMeshQuaternion(this.lBoneGroup, q);    
    this.physics.setMeshPosition(this.lBoneGroup, this.lBoneGroup.position);        
    
  }
  
  updateHand(hand, handBones, handMeshes){
    if(!hand)
      return;
    
    var bone = null;
    var handBoneMesh = null;
    for(var i=0;handBones && i<handBones.length;i++){
        bone = handBones[i];
        if(bone && handMeshes[i]){
          handBoneMesh = handMeshes[i];
          if(handBoneMesh){
            try {
                handBoneMesh.position.x = bone.position.x*0.01;
                handBoneMesh.position.y = bone.position.y*0.01;
                handBoneMesh.position.z = bone.position.z*0.01;
                handBoneMesh.rotation.x = bone.rotation.x;
                handBoneMesh.rotation.y = bone.rotation.y;
                handBoneMesh.rotation.z = bone.rotation.z;
                this.physics.setMeshPosition(handBoneMesh, handBoneMesh.position);
            }catch(e){
              console.log(e);
            }
          }
        }
      }
  }
  
  

  setupHandBone(hand, rl, boneName, bones, meshes){
    if(!hand)
      return;    
      
    const bone = hand.getObjectByName( boneName.replace( /%/g, rl) );
    bones.push( bone );
    var boneMesh = null;
    
    if(bone){
      var mult = 1.0;
      if(boneName.indexOf("wrist") >= 0)
        mult = 3.0;
      if(boneName.indexOf('1') >= 0)
        mult = 1.95;
      var geometry = new THREE.SphereBufferGeometry(0.01*mult, 10, 10);
      var material = new THREE.MeshLambertMaterial({ color: 0xff0000, opacity:0, transparent:true  });
      boneMesh = new THREE.Mesh(geometry, material);
      boneMesh.receiveShadow = true;
      boneMesh.castShadow = false;
      var matrix = new THREE.Matrix4();     
      matrix.compose(
        new THREE.Vector3(bone.position.x*0.05, bone.position.y*0.05, bone.position.z*0.05),
        new THREE.Quaternion(bone.quaternion.x, bone.quaternion.y, bone.quaternion.z, bone.quaternion.w),
        new THREE.Vector3(1.0,1.0,1.0)
      );
      boneMesh.applyMatrix4(matrix);      
      meshes.push(boneMesh);
      hand.add(boneMesh);
      this.physics.addMesh(boneMesh, 0);
    }else {
      meshes.push(null);
    }   
    
    return boneMesh;
  }

}

export { XRHandPhysics };