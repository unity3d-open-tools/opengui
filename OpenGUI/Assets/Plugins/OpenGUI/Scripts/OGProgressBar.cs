using UnityEngine;
using System.Collections;

public class OGProgressBar : OGWidget {
	public enum LayoutType {
		Horizontal,
		Vertical
	}

	public float value = 0.5f;
	public Vector2 padding;
	public LayoutType type;

	public void SetValue ( float value ) {
		if ( this.value == value ) { return; }

		this.value = value;
		value = Mathf.Clamp ( value, 0, 1 );
	}

	private Rect GetThumbRect () {
		if ( type == LayoutType.Horizontal ) {
			return new Rect ( drawRct.x + padding.x, drawRct.y + padding.y, ( drawRct.width - ( padding.x * 2 ) ) * value, drawRct.height - ( padding.y * 2 ) );
		} else {
			return new Rect ( drawRct.x + padding.x, drawRct.y + padding.y, ( drawRct.width - ( padding.x * 2 ) ), (drawRct.height - ( padding.y * 2 )) * value );

		}
	}


	/////////////////
	// Draw
	/////////////////
	override public void DrawSkin () {
		// Background
		OGDrawHelper.DrawSlicedSprite ( drawRct, styles.basic, drawDepth, tint, clipTo );

		// Thumb
		OGDrawHelper.DrawSprite ( GetThumbRect (), styles.thumb, drawDepth, tint, clipTo );
	}
}
