using UnityEngine;
using System.Collections;
using System.Text.RegularExpressions;

public class OGTextField : OGWidget {
	public enum RegExPreset {
		None,
		OnlyNumbers,
		OnlyNumbersAndPeriod,
		OnlyASCII,
		NoSpaces
	}
	
	public string text = "";
	public int maxLength = 200;
	public string regex;
	public RegExPreset regexPreset;
	public bool locked = false;
	public bool singleLine = false;
	public bool fitToText = false;
	public bool hideText = false;
	public OGTextEditor betaEditor = new OGTextEditor ();

	[HideInInspector] public bool listening = false;

	private RegExPreset currentPreset = RegExPreset.None;


	//////////////////
	// Interaction
	//////////////////
	override public void OnMouseDown () {
		listening = true;

		betaEditor.cursorPos = Input.mousePosition;
	}

	override public void OnMouseDrag () {
		listening = true;
		
		betaEditor.cursorSelectPos = Input.mousePosition;
	}

	override public void OnMouseCancel () {
		listening = false;
	}

	public void OnGUI () {
		if ( listening ) {
			if ( !betaEditor.enabled ) {
				GUI.SetNextControlName ( "ActiveTextField" );
				
				GUIStyle style = new GUIStyle();
				style.normal.textColor = currentStyle.text.fontColor;
				style.font = currentStyle.text.font.dynamicFont;
				style.fontSize = currentStyle.text.fontSize;
				style.alignment = currentStyle.text.alignment;
				style.wordWrap = currentStyle.text.wordWrap;
				style.padding = currentStyle.text.padding;
				style.clipping = TextClipping.Clip;
				
				Color c = currentStyle.text.fontColor;
				GUI.skin.settings.selectionColor = new Color ( 1.0f - c.r, 1.0f - c.g, 1.0f - c.b, c.a );
				
				Rect invertedRct = drawRct;
				
				invertedRct.y = Screen.height - invertedRct.y - invertedRct.height;
				
				if ( string.IsNullOrEmpty ( text ) ) {
					text = "";
				}
				
				text = GUI.TextArea ( invertedRct, text, style );
				
				if ( singleLine ) {
					text = text.Replace("\n", "").Replace("\r", "");
				}
				
				GUIUtility.GetControlID(drawRct.GetHashCode(), FocusType.Keyboard);
				
				GUI.FocusControl ( "ActiveTextField" );	
			}
		}	
	}

	////////////////////
	// Update
	////////////////////
	override public void UpdateWidget () {
		// Persistent vars
		isSelectable = true;

		if ( fitToText ) {
			singleLine = true;
		}

		// Update data
		mouseRct = drawRct;
		isAlwaysOnTop = listening;
		
		if ( fitToText ) {
			this.transform.localScale = new Vector3 ( OGDrawHelper.GetLabelWidth ( text, currentStyle.text ), this.transform.localScale.y, this.transform.localScale.z );
		}
		
		if ( string.IsNullOrEmpty ( text ) ) {
			text = "";
		}

		if ( singleLine ) {
			text = text.Replace("\n", "").Replace("\r", "");
		}

		if ( !string.IsNullOrEmpty ( regex ) && regex != "\\" && regexPreset != RegExPreset.None ) {
			text = Regex.Replace ( text, "[" + regex + "]", "" );
		}

		// Styles
		if ( listening ) {
			currentStyle = styles.active;
		} else {
			currentStyle = styles.basic;
		}

		if ( betaEditor.enabled ) {
			text = betaEditor.Update ( text, drawRct );
		}

		// ^ Regex presets
		if ( regexPreset != currentPreset ) {
			currentPreset = regexPreset;
			
			if ( currentPreset == RegExPreset.None ) {
				regex = "";
		
			} else if ( currentPreset == RegExPreset.OnlyNumbers ) {
				regex = "^0-9";
				
			} else if ( currentPreset == RegExPreset.OnlyASCII ) {
				regex = "^a-zA-Z0-9";
				
			} else if ( currentPreset == RegExPreset.NoSpaces ) {
				regex = " ";
				
			} else if ( currentPreset == RegExPreset.OnlyNumbersAndPeriod) {
				regex = "^0-9.";
				
			}
		}
	}


	/////////////////
	// Draw
	/////////////////
	override public void DrawSkin () {
		OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle, drawDepth, tint, clipTo );
	
		if ( listening && betaEditor.enabled ) {
			Color color = tint;
			
			if ( betaEditor.cursorIndex != betaEditor.cursorSelectIndex ) {
				color = new Color ( 1 - color.r, 1 - color.g, 1 - color.b, color.a );
				
				for ( int i = 0; i < betaEditor.selectionRects.Length; i++ ) {
					OGDrawHelper.DrawSprite ( betaEditor.selectionRects[i], styles.thumb, drawDepth, color, this );
				}
			
			} else {
				OGDrawHelper.DrawSprite ( betaEditor.cursorRect, styles.thumb, drawDepth, color, this );
			
			}
		}
	}

	override public void DrawText () {
		if ( !listening || betaEditor.enabled ) {
			if ( hideText ) {
				string secure = "";

				for ( int i = 0; i < text.Length; i++ ) {
					secure += "*";
				}

				OGDrawHelper.DrawLabel ( drawRct, secure, currentStyle.text, drawDepth, tint, this, betaEditor );
			
			} else {
				OGDrawHelper.DrawLabel ( drawRct, text, currentStyle.text, drawDepth, tint, this, betaEditor );
			
			}
		}
	}
}
