var NW = function() {

	this.gui = require('nw.gui');
	this.fs = require('fs');
	this.path = require('path');
	this.execFile = require('child_process').execFile;
	this.appExe = 'tagame';

	this.isWindows = process.platform.match(/^win/);
	this.isOSX = process.platform.match(/^darwin/);
	this.isLinux = process.platform.match(/^linux/);

	this.OS = null;
	this.dir = {
		ds: '/',
		app: '',
		parent: ''
	};

	this.url = {
		remote: 'http://play.treasurearena.com'
	};


	this.maximize = function() {

		var win = this.gui.Window.get();

		win.show();
		win.maximize();

	};

	this.restart = function() {

		if (this.isWindows) {
			this.gui.Shell.openItem(this.dir.app + this.appExe + '.exe');
		} else {
			// linux only
			this.fs.chmodSync(this.dir.parent + appExe, '755');
			this.execFile(this.dir.parent + appExe, [], {cwd: this.dir.parent});
		}

		this.gui.Window.get().close(true);

	};

	this.detectOS = function() {

		if (this.isWindows) {
			this.OS = 'win';
			this.dir.ds = '\\';
		}
		if (this.isOSX) this.OS = 'osx';
		if (this.isLinux) this.OS = 'linux';

	};

	this.getAppDir = function() {

		var pathFrags = process.execPath.split(this.dir.ds);

		for (var i = 0; i < pathFrags.length - 1; i++) {
			this.dir.app += pathFrags[i] + this.dir.ds;
		}

		this.dir.parent = this.path.join(this.dir.app, '..' + this.dir.ds);

	};

	this.init = function() {

		this.maximize();
		this.detectOS();
		this.getAppDir();


	};

};