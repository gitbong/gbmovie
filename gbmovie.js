/**
 * Created by gitbong on 5/6/16.
 */
var gb = gb || {};
(function (ins) {

	ins.movie = function ($dom, frameRate, totalFrame) {
		var mc = new Movie($dom, frameRate, totalFrame);
		return mc;
	};

	var Movie = function ($dom, frameRate, totalFrame) {

		var self = this;
		var _$frams = [];
		var _timer = -1;
		var _frameRate = frameRate;
		var _stateFnArr = [];
		var _targetFrame = totalFrame - 1;
		var _dir = 1;

		self.preFrame = 0;
		self.currentFrame = 0;
		self.totalFrame = totalFrame;
		self.loop = false;
		self.isPlaying = false;

		function _ctor() {
			for (var i = 0; i < totalFrame; i++) {
				$dom.append("<div class='" + "frame" + i + " gbmovie'  style='display:none'></div>");
				_$frams.push($dom.find('.frame' + i));
			}
			_renderFrame(0);
		}

		_ctor();

		self.play = function () {
			self.stop();
			_timer = setInterval(_render, 1000 / _frameRate);
		};
		self.stop = function () {
			clearInterval(_timer);
			self.isPlaying = false;
		};
		self.gotoAndPlay = function (frame) {
			self.preFrame = self.currentFrame;
			self.currentFrame = _frame(frame);
			self.play();
		};
		self.gotoAndStop = function (frame) {
			self.stop();
			self.preFrame = self.currentFrame;
			self.currentFrame = _frame(frame);
			_renderFrame(frame);
		};
		self.playTo = function (frame) {
			if (frame < self.currentFrame) {
				_dir = -1;
			} else {
				_dir = 1;
			}
		};
		self.getPlayState = function (fn) {
			_stateFnArr.push(fn);
		};
		self.setFrameRate = function (frameRate) {
			_frameRate = frameRate;
			self.stop();
			self.play();
		};

		self.getDom = function () {
			return $dom;
		};

		function _frame(frame) {
			var f = frame;
			if (f < 0)f = 0;
			if (f >= totalFrame)f = totalFrame - 1;
			return f;
		}

		function _renderFrame(frame) {
			_$frams[self.preFrame].hide();
			self.currentFrame = frame;
			_$frams[self.currentFrame].show();

			for (var i = 0; i < _stateFnArr.length; i++) {
				_stateFnArr[i].call(self, self.currentFrame);
			}
		}

		function _render() {
			self.isPlaying = true;
			_renderFrame(self.currentFrame);
			self.preFrame = self.currentFrame;
			self.currentFrame += _dir;

			if (self.currentFrame > _targetFrame) {
				if (self.loop) {
					self.preFrame = _targetFrame;
					self.currentFrame = 0;
					_renderFrame(self.currentFrame);
				} else {
					self.preFrame = self.currentFrame;
					self.currentFrame = _targetFrame;
					self.stop();
				}
			} else {
				_renderFrame(self.currentFrame);
			}

		}
	}
})(gb);