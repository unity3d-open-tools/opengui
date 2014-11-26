using UnityEngine;
using System.Collections;

public class OGTestWidget : OGWidget {
	public Texture2D mainTexture;
	
	private Material material;

	private Matrix4x4 matrix;
	
	private Vector3 GetVector ( float x, float y ) {
		float height = this.transform.localScale.y;
		float width = this.transform.localScale.x;
		float depth = this.transform.position.z;
	
		float left = 0;
		float top = -height;

		switch ( pivot.x ) {
			case RelativeX.Center:
				left = -width / 2;
				break;
			
			case RelativeX.Right:
				left = -width;
				break;
		}
		
		switch ( pivot.y ) {
			case RelativeY.Center:
				top = -height / 2;
				break;
			
			case RelativeY.Bottom:
				top = 0;
				break;
		}

		return matrix.MultiplyPoint3x4 ( new Vector3 ( x * width + left, y * height + top, depth ) );
	}

	override public void UpdateWidget () {
		mouseRct = drawRct;
	}

	override public void DrawGL () {
		if ( drawRct == new Rect() || mainTexture == null ) {
			return;
		}
	
		if ( material == null ) {
			material = new Material ( root.skin.atlas.shader );
			return;
		}

		if ( material.mainTexture != mainTexture ) {
			material.mainTexture = mainTexture;
			return;
		}

		matrix.SetTRS ( new Vector3 ( this.transform.position.x, root.screenHeight - this.transform.position.y, drawDepth ), Quaternion.Euler ( 0, 0, -this.transform.eulerAngles.z ), Vector3.one );

		Rect uvRct = new Rect ( 0, 0, 1, 1 );

		GL.Begin(GL.QUADS);
		
		GL.Color ( tint );
		
		material.SetPass ( 0 );

		// Bottom Left
		GL.TexCoord2 ( uvRct.x, uvRct.y );
		GL.Vertex ( GetVector ( 0, 0 ) );
		
		// Top left
		GL.TexCoord2 ( uvRct.x, uvRct.y + uvRct.height );
		GL.Vertex ( GetVector ( 0, 1 ) );
		
		// Top right
		GL.TexCoord2 ( uvRct.x + uvRct.width, uvRct.y + uvRct.height );
		GL.Vertex ( GetVector ( 1, 1 ) );
		
		// Bottom right
		GL.TexCoord2 ( uvRct.x + uvRct.width, uvRct.y );
		GL.Vertex ( GetVector ( 1, 0 ) );
		
		GL.Color ( Color.white );

		GL.End();
	}
}
