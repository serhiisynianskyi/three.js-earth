export default vertexShader;
function vertexShader(){
	return `
		precision mediump float;
		precision mediump int;

		uniform mat4 modelViewMatrix; 
		uniform mat4 projectionMatrix; 

		attribute vec3 position;
		attribute vec4 color;

		varying vec3 vPosition;

		void main() {

			vPosition = position;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`
};