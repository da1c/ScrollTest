class ModelView {
  constructor() {
    // 現在表示中のメッシュ
    this.nowMesh = null;

    // scene
    this.scene = null;
    // カメラ
    this.camera = null;
    // ライト
    this.renderer = null;

    // モデルローダー
    this.loader = null;
    this.textureLoader = null;
    // 壁メッシュ
    this.wallObj = null;
    // 床メッシュ
    this.floorObj = null;
    // 平行光源
    this.dirLight = null;
  }

  Init(width, height) {
    var canvas3D = document.querySelector("#Canvas3D");
    // レンダラー作成
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas3D,
      antialias: true,
    });

    // デバイスピクセル比の設定
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // レンダラーのサイズ指定
    this.renderer.setSize(width, height);
    // 背景色の設定
    this.renderer.setClearColor(0xf9f6f4, 1.0);

    // シーン作成
    this.scene = new THREE.Scene();

    // カメラ作成
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 100, 100);

    this.Resize(width,height);

    var orbit = new THREE.OrbitControls(this.camera, canvas3D);
    orbit.target.set(0, 0, 0);

    orbit.enableDamping = true;
    orbit.dampingFactor = 0.05;
    orbit.screenSpacePanning = false;

    orbit.minDistance = 100;
    orbit.maxDistance = 500;
    // パンの無効化
    orbit.enablePan = true;

    // 平行光源
    this.dirLight = new THREE.DirectionalLight(0xffffff);
    this.dirLight.intensity = window.dataMng.GetDirLightIntensity();
    this.dirLight.position.set(1, 1, 1);

    this.scene.add(this.dirLight);

    // アンビエントライト
    var ambientLight = new THREE.AmbientLight(0x444444, 1.0);
    this.scene.add(ambientLight); // 壁メッシュと床メッシュの作成

    let geometry = new THREE.PlaneGeometry(1000, 500, 1);
    // テクスチャローダー作成
    this.textureLoader = new THREE.TextureLoader();

    // テクスチャロード
    // 床
    this.textureLoader.load("./img/floor.png", (texture) => {
      let floor_mat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.FrontSide,
      });
      floor_mat.map.wrapS = THREE.RepeatWrapping;
      floor_mat.map.wrapT = THREE.RepeatWrapping;
      floor_mat.map.repeat.set(16, 16);
      this.floorObj = new THREE.Mesh(geometry, floor_mat);
      this.floorObj.rotation.set(-Math.PI / 2, 0, 0);
      //
      let pos = window.dataMng.GetNowModelFloorPos();
      this.floorObj.position.set(pos.x, pos.y, pos.z);
      this.scene.add(this.floorObj);
    });

    // 壁
    this.textureLoader.load("./img/wall.png", (texture) => {
      let wall_mat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.FrontSide,
      });
      wall_mat.map.wrapS = THREE.RepeatWrapping;
      wall_mat.map.wrapT = THREE.RepeatWrapping;
      wall_mat.map.repeat.set(16, 16);
      this.wallObj = new THREE.Mesh(geometry, wall_mat);
      let pos = window.dataMng.GetNowModelWallPos();
      this.wallObj.position.set(pos.x, pos.y, pos.z);
      this.scene.add(this.wallObj);
    });

    // モデルの読み込み
    // ローダー作成
    this.loader = new THREE.FBXLoader();
    // モデルのロード
    var modelPath = window.dataMng.GetNowModelPath();
    this.loader.load(modelPath, (obj) => {
      // 読み込んだモデルをcache
      obj.rotation.set(0, 0, 0);
      this.nowMesh = obj;
      // シーンに追加
      this.scene.add(this.nowMesh);
    });
  }
  /**
   *モデル切り替え
   *
   * @param {*} id
   */

  SetModel(modelPath, wallPos, floorPos) {
    // 現在のモデルを削除
    this.scene.remove(this.nowMesh);
    //this.nowMesh.material.dispose();
    //this.nowMesh.geometry.dispose();

    // モデル
    this.loader.load(modelPath, (obj) => {
      // 読み込んだモデルをcache
      obj.rotation.set(0, 0, 0);
      this.nowMesh = obj;

      this.scene.add(this.nowMesh);

      // 床、壁の座標移動
      this.wallObj.position.set(wallPos.x, wallPos.y, wallPos.z);
      this.floorObj.position.set(floorPos.x, floorPos.y, floorPos.z);
    });
  }

  /**
   *平行光源の強さ設定
   *
   * @memberof modelView
   */
  SetDirLightIntensity(intensity) {
    this.dirLight.intensity = intensity;
  }

  Resize(width, height) {
    // デバイスピクセル比の設定
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // レンダラーのサイズ指定
    this.renderer.setSize(width, height);

    // カメラ修正
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  // 描画
  Render(){
    this.renderer.render(this.scene, this.camera);
  }

}

