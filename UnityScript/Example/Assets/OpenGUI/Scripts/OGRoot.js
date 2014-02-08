#pragma strict

import System.Collections.Generic;

@script ExecuteInEditMode();
class OGLine {
	public var start : Vector3;
	public var end : Vector3;

	function OGLine ( start : Vector3, end : Vector3 ) {
		this.start = start;
		this.end = end;
	}
}

class OGRoot extends MonoBehaviour {
	public static var instance : OGRoot;

	public var skin : OGSkin;
	public var currentPage : OGPage;
	public var lineMaterial : Material;
	public var lines : OGLine[];
	public var lineClip : Rect;

	@HideInInspector public var unicode : Dictionary.< int, int >[];
	@HideInInspector public var isMouseOver : boolean = false;
	@HideInInspector public var texWidth : int = 256;
	@HideInInspector public var texHeight : int = 256;

	private var dirtyCounter : int = 0;
	private var widgets : OGWidget[];
	private var mouseOver : List.< OGWidget > = new List.< OGWidget > ();
	private var downWidget : OGWidget;
	private var screenRect : Rect;
	private var textureMaterials : Material[];


	//////////////////
	// Instance
	//////////////////
	public static function GetInstance () {
		return instance;
	}

	
	//////////////////
	// Font helpers
	//////////////////
	public function GetUnicode ( index : int ) : Dictionary.< int, int > {
		if ( unicode == null ) {
			ReloadFonts ();
		}

		return unicode[index];
	}

	public function ReloadFonts () {
		unicode = new Dictionary.< int, int > [ skin.fonts.Length ];
		
		for ( var i : int = 0; i < skin.fonts.Length; i++ ) {
			if ( unicode[i] == null ) {
				unicode[i] = new Dictionary.< int, int >();
				
				for ( var c : int = 0; c < skin.fonts[i].characterInfo.Length; c++ ) {
					if ( unicode[i].ContainsKey ( skin.fonts[i].characterInfo[c].index ) ) {
						unicode[i][skin.fonts[i].characterInfo[c].index] = c;
					} else {
						unicode[i].Add ( skin.fonts[i].characterInfo[c].index, c );
					}
				}
			}
		}
					
	}

	
	//////////////////
	// Page management
	//////////////////
	public function SetCurrentPage ( page : OGPage ) {
		currentPage = page;

		for ( var p : OGPage in this.GetComponentsInChildren.<OGPage>(true) ) {
			p.gameObject.SetActive ( p == currentPage );
		}
	}
	
	public function GoToPage ( pageName : String ) {
		if ( currentPage != null ) {
			currentPage.ExitPage ();
			
			currentPage.gameObject.SetActive ( false );
		}
		
		for ( var p : OGPage in this.GetComponentsInChildren.<OGPage>(true) ) {
			if ( p.pageName == pageName ) {
				currentPage = p;
			}
		}
		
		if ( currentPage != null ) {
			currentPage.gameObject.SetActive ( true );
		
			currentPage.StartPage ();
		}

		SetDirty ();
	}

	
	//////////////////
	// Draw loop
	//////////////////
	public function OnPostRender () {
		if ( widgets != null ) {
			var i : int = 0;
			var o : int = 0;
			var w : OGWidget;
			
			GL.PushMatrix();
			GL.LoadPixelMatrix ();

			// Draw skin
			GL.Begin(GL.QUADS);
			OGDrawHelper.SetPass(skin.atlas);
			
			for ( i = 0; i < widgets.Length; i++ ) {
				w = widgets[i];
				
				if ( w == null ) { continue; }
				
				if ( w.gameObject.activeSelf && w.isDrawn && w.drawRct.height > 0 && w.drawRct.width > 0 ) {
					GL.Color ( w.color );
					w.DrawSkin ();
					GL.Color ( Color.white );
				}
			}
			
			GL.End ();
			
			// Draw text
			for ( i = 0; i < skin.fonts.Length; i++ ) {
				if ( skin.fonts[0] == null ) { continue; }
				
				GL.Begin(GL.QUADS);
				
				if ( skin.fontShader != null ) {
					skin.fonts[i].material.shader = skin.fontShader;
				}
				
				OGDrawHelper.SetPass ( skin.fonts[i].material );

				for ( o = 0; o < widgets.Length; o++ ) {
					w = widgets[o];
				
					if ( w == null ) { continue; }

					if ( w.styles == null ) {
						skin.GetDefaultStyles ( w );

					} else if ( w.isDrawn && w.gameObject.activeSelf ) {
						if ( w.styles.basic != null && w.styles.basic.text.fontIndex == i ) {
							w.DrawText ();
						}
					}
				}
				
				GL.End ();
			}
			
			// Draw lines
			if ( lines != null && lines.Length > 0 ) {
				GL.Begin(GL.LINES);
				lineMaterial.SetPass(0);
				for ( i = 0; i < lines.Length; i++ ) {
					var noClip : boolean = lineClip.width <= 0 || lineClip.height <= 0;
					var containsStart : boolean = lineClip.Contains ( lines[i].start );
					var containsEnd : boolean = lineClip.Contains ( lines[i].end );

					if ( noClip || containsStart ) {
						GL.Vertex3 ( lines[i].start.x, Screen.height - lines[i].start.y, 0 );
					} else if ( containsEnd ) {
						GL.Vertex3 ( Mathf.Clamp ( lines[i].start.x, lineClip.xMin, lineClip.xMax ), Mathf.Clamp ( Screen.height - lines[i].start.y, lineClip.yMin, lineClip.yMax ), 0 );
					}
					
					if ( noClip || containsEnd ) {
						GL.Vertex3 ( lines[i].end.x, Screen.height - lines[i].end.y, 0 );
					} else if ( containsStart ) {
						GL.Vertex3 ( Mathf.Clamp ( lines[i].end.x, lineClip.xMin, lineClip.xMax ), Mathf.Clamp ( Screen.height - lines[i].end.y, lineClip.yMin, lineClip.yMax ), 0 );
					}
				}	
			
				GL.End();
			}

			
			// Draw textures
			for ( i = 0; i < widgets.Length; i++ ) {	
				w = widgets[i];
				
				if ( w != null && w.gameObject.activeSelf && w.isDrawn ) {
					GL.Color ( w.color );
					w.DrawGL();
					GL.Color ( Color.white );
				}
			}


			GL.PopMatrix();
		}
	}
	
	
	//////////////////
	// Init
	//////////////////
	public function Start () {
		if ( currentPage != null && Application.isPlaying ) {
			currentPage.StartPage ();
		}
	}


	//////////////////
	// Update
	//////////////////
	public function SetDirty ( s : int ) {
		dirtyCounter = s;
	}

	public function SetDirty () {
		dirtyCounter = 2;
	}
	
	public function ReleaseWidget () {
		downWidget = null;
	}

	public function Update () {
		if ( instance == null ) {
			instance = this;
		}

		this.transform.localScale = Vector3.one;
		this.transform.localPosition = Vector3.zero;
		this.transform.localEulerAngles = Vector3.zero;

		// Only update these when playing
		if ( Application.isPlaying && currentPage != null ) {
			// Current page
			currentPage.UpdatePage ();

			// Mouse interaction
			UpdateMouse ();	
		}

		// Dirty
		if ( dirtyCounter > 0 ) {
			texWidth = skin.atlas.mainTexture.width;
			texHeight = skin.atlas.mainTexture.height;

			UpdateWidgets ( false );
			dirtyCounter--;
		
		// Update positions
		} else {
			UpdateWidgets ( true );

		}
	}


	//////////////////
	// Mouse interaction
	//////////////////
	public function UpdateMouse () {
		if ( widgets == null ) { return; }
		
		var i : int = 0;
		var w : OGWidget;

		// Click
		if ( Input.GetMouseButtonDown ( 0 ) || Input.GetMouseButtonDown ( 2 ) ) {
			var topWidget : OGWidget;
			
			for ( i = 0; i < mouseOver.Count; i++ ) {
				w = mouseOver[i];
				
				if ( ( topWidget == null || w.transform.position.z < topWidget.transform.position.z ) && w.isSelectable ) {
				        if ( w.GetComponent(OGScrollView) ) {
						if ( Input.GetMouseButton ( 2 ) || w.GetComponent(OGScrollView).touchControl ) {	
							topWidget = w;
						}
					} else {
						topWidget = w;
					}
				}
			}
			
			if ( downWidget && downWidget != topWidget ) {
				downWidget.OnMouseCancel ();
			}
			
			if ( topWidget != null && !topWidget.isDisabled ) {
				topWidget.OnMouseDown ();
				downWidget = topWidget;
			}

		// Release
		} else if ( Input.GetMouseButtonUp ( 0 ) || Input.GetMouseButtonUp ( 2 ) ) {
			if ( downWidget ) {
				// Draggable
				if ( downWidget.resetAfterDrag && !downWidget.GetComponent(OGScrollView) ) {
					downWidget.transform.position = downWidget.dragOrigPos;
					downWidget.dragOffset = Vector3.zero;
					downWidget.dragOrigPos = Vector3.zero;
				}
				
				// Mouse over
				if ( downWidget.CheckMouseOver() && !downWidget.isDisabled ) {
					downWidget.OnMouseUp ();

				// Mouse out
				} else {
					downWidget.OnMouseCancel ();
				
				}
			
			}
		
		// Dragging
		} else if ( Input.GetMouseButton ( 0 ) || Input.GetMouseButton ( 2 ) ) {
			if ( downWidget != null && !downWidget.isDisabled ) {
				downWidget.OnMouseDrag ();
			
				if ( downWidget.isDraggable && downWidget.GetType() != OGScrollView ) {
					var mousePos : Vector3 = Input.mousePosition;
					mousePos.y = Screen.height - mousePos.y;

					if ( downWidget.dragOffset == Vector3.zero ) {
						if ( downWidget.resetAfterDrag ) {
							downWidget.dragOrigPos = downWidget.transform.position;
						}

						downWidget.dragOffset = downWidget.transform.position - mousePos;
					}

					var newPos : Vector3 = downWidget.transform.position;
					newPos = mousePos + downWidget.dragOffset;
					downWidget.transform.position = newPos;
					SetDirty ();
				}
			}
		}

		// Escape key
		if ( Input.GetKeyDown ( KeyCode.Escape ) ) {
			if ( downWidget != null ) {
				downWidget.OnMouseCancel ();
				ReleaseWidget ();
			}
		}
	}	

	// OnGUI selection
	public static var EditorSelectWidget : Function;
	private static var editWidget : OGWidget;
	private static var draggingWidget : boolean = false;
	private static var scalingWidgetX : boolean = false;
	private static var scalingWidgetY : boolean = false;

	private function FindMouseOverWidget ( e : Event ) : OGWidget {
		var w : OGWidget;

		for ( var i : int = 0; i < widgets.Length; i++ ) {
			if ( widgets[i].drawRct.Contains ( new Vector2 ( e.mousePosition.x, Screen.height - e.mousePosition.y ) ) ) {
				if ( w == null || w.drawDepth < widgets[i].drawDepth ) {
					w = widgets[i];
				}
			}
		}

		return w;
	}

	public function OnGUI () {
		var e : Event = Event.current;
		var revRect : Rect;
		var pivotRect : Rect;
		var scaleXRect : Rect;
		var scaleYRect : Rect;

		if ( !Application.isPlaying ) {
			if ( editWidget != null ) {
				revRect = editWidget.drawRct;
				revRect.y = Screen.height - revRect.y - revRect.height;

				pivotRect = new Rect ( editWidget.transform.position.x - 2, editWidget.transform.position.y - 2, 4, 4 );
				scaleXRect = new Rect ( revRect.xMax, revRect.center.y - 6, 6, 12 );
				scaleYRect = new Rect ( revRect.center.x - 6, revRect.yMax, 12, 6 );

				var color : Color = Color.white;//new Color ( 0.19, 0.3, 0.47, 1 );
				
				if ( editWidget.pivot.x == RelativeX.Right ) { scaleXRect.center.x = revRect.xMax + 3; }
				if ( editWidget.pivot.y == RelativeY.Bottom ) { scaleYRect.center.y = revRect.yMin - 3; }

				var tex : Texture2D = new Texture2D ( 1, 1 );
				tex.SetPixel ( 0, 0, color );
				tex.Apply ();

				var style : GUIStyle = new GUIStyle();
				style.normal.background = tex;
				
				var textStyle : GUIStyle = new GUIStyle();
				textStyle.fontSize = 14;
				textStyle.normal.textColor = Color.white;
				textStyle.alignment = TextAnchor.MiddleCenter;

				Handles.color = color;

				e = Event.current;

				// Draw outline
				Handles.DrawPolyLine (
					new Vector3 ( revRect.xMin, revRect.yMin, 0 ),
					new Vector3 ( revRect.xMin, revRect.yMax, 0 ),
					new Vector3 ( revRect.xMax, revRect.yMax, 0 ),
					new Vector3 ( revRect.xMax, revRect.yMin, 0 ),
					new Vector3 ( revRect.xMin, revRect.yMin, 0 )
				);

				// Draw pivot
				GUI.Box ( pivotRect, "", style );

				// Draw scale
				GUI.Box ( scaleXRect, "", style );
				GUI.Box ( scaleYRect, "", style );
			}

			switch ( e.type ) { 
				case EventType.MouseDown:
					var w : OGWidget = FindMouseOverWidget ( e );

					if ( editWidget != w && w != null ) {
						EditorSelectWidget ( w );
						editWidget = w;
						revRect = editWidget.drawRct;
						revRect.y = Screen.height - revRect.y - revRect.height;
						scaleXRect = new Rect ( revRect.xMax, revRect.center.y - 6, 6, 12 );
						scaleYRect = new Rect ( revRect.center.x - 6, revRect.yMax, 12, 6 );
					}	
					
					if ( revRect.Contains ( e.mousePosition ) ) {
						draggingWidget = true;
					
					} else if ( scaleXRect.Contains ( e.mousePosition ) ) {
						scalingWidgetX = true;
					
					} else if ( scaleYRect.Contains ( e.mousePosition ) ) {
						scalingWidgetY = true;
					
					} else if ( w == null ) {
						editWidget = null;
				
					}

					break;

				case EventType.MouseDrag:
					if ( editWidget == null ) { break; }
					
					var delta : Vector2 = e.delta;
					var vModifier : Vector2 = Vector2.one;
					var scrollView : OGScrollView = editWidget as OGScrollView;
					if ( editWidget.pivot.y == RelativeY.Center ) { vModifier.y = 2; }
					else if ( editWidget.pivot.y == RelativeY.Bottom ) { vModifier.y = -1; }
					if ( editWidget.pivot.x == RelativeX.Center ) { vModifier.x = 2; }
					
					if ( scalingWidgetX && editWidget ) {
						if ( scrollView ) {
							scrollView.size.x += delta.x * vModifier.x;
						} else {
							editWidget.transform.localScale += new Vector3 ( delta.x * vModifier.x, 0, 0 );
						}

					} else if ( scalingWidgetY && editWidget ) {
						if ( scrollView ) {
							scrollView.size.y += delta.y * vModifier.y;
						} else {
							editWidget.transform.localScale += new Vector3 ( 0, delta.y * vModifier.y, 0 );
						}

					} else if ( draggingWidget && editWidget ) {
						editWidget.transform.localPosition += new Vector3 ( delta.x, delta.y, 0 );
					
					}

					break;

				case EventType.MouseUp:
					draggingWidget = false;
					scalingWidgetX = false;
					scalingWidgetY = false;

					break;
				
				case EventType.KeyDown:
					if ( editWidget == null ) { break; }

					var modifier : int = 1;

					if ( e.shift ) {
						modifier = 10;
					}

					switch ( e.keyCode ) {
						case KeyCode.UpArrow:
							editWidget.transform.position -= new Vector3 ( 0, modifier, 0 );
							break;
						
						case KeyCode.DownArrow:
							editWidget.transform.position += new Vector3 ( 0, modifier, 0 );
							break;
						
						case KeyCode.LeftArrow:
							editWidget.transform.position -= new Vector3 ( modifier, 0, 0 );
							break;
						
						case KeyCode.RightArrow:
							editWidget.transform.position += new Vector3 ( modifier, 0, 0 );
							break;
					}

					break;
			}
		}
	}


	//////////////////
	// Widget management
	//////////////////
	public function UpdateWidgets ( onlyPositions : boolean ) {
		screenRect = new Rect ( 0, Screen.width, 0, Screen.height );

		if ( currentPage == null ) { return; }
		
		mouseOver.Clear ();
		
		// Index font unicode
		if ( unicode == null || unicode.Length != skin.fonts.Length ) {
			ReloadFonts ();
		}
		
		// Update widget lists	
		widgets = currentPage.gameObject.GetComponentsInChildren.<OGWidget>();

		for ( var i : int = 0; i < widgets.Length; i++ ) {
			var w : OGWidget = widgets[i];

			if ( w == null || !w.isDrawn ) { continue; }
			
			// Check mouse
			if ( w.CheckMouseOver() ) {
				w.OnMouseOver ();
				mouseOver.Add ( w );
			}
			
			w.root = this;			
			w.UpdateWidget ();
			w.Recalculate ();

			// Cleanup from previous OpenGUI versions
			if ( w.hidden ) {
				DestroyImmediate ( w.gameObject );
			}
		}
		
		// Is mouse over anything?
		isMouseOver = mouseOver.Count > 0;
	}
}
