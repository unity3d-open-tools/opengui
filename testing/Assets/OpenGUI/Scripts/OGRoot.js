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
	private var labels : OGLabel[];
	private var textures : OGTexture[];
	private var mouseOver : List.< OGWidget > = new List.< OGWidget > ();
	private var downWidget : OGWidget;
	private var screenRect : Rect;
	private var textureMaterial : Material;

	public static function GetInstance () {
		return instance;
	}

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

	public function OnPostRender () {
		if ( widgets != null && labels != null ) {
			var i : int = 0;
			var o : int = 0;
			var w : OGWidget;
			
			GL.PushMatrix();
			GL.LoadPixelMatrix ();

			// Draw quads
			GL.Begin(GL.QUADS);
			skin.atlas.SetPass(0);
			
			for ( i = 0; i < widgets.Length; i++ ) {
				w = widgets[i];
				
				if ( w == null || w.GetComponent ( OGLabel ) || w.GetComponent ( OGTexture ) ) { continue; }
				
				if ( w.isDrawn ) {
					if ( w.clipRct.width < 1 || w.clipRct.height < 1 ) {
						w.clipRct = new Rect ( 0, 0, Screen.width, Screen.height );
					}

					//skin.atlas.SetVector ( "_ClipRect", new Vector4 ( w.clipRct.x, w.clipRct.width, w.clipRct.y, w.clipRct.height ) ); 
					w.DrawGL ();
				}
			}
			
			GL.End ();
			
			// Draw labels
			for ( i = 0; i < skin.fonts.Length; i++ ) {
				if ( skin.fonts[0] == null ) { continue; }
				
				GL.Begin(GL.QUADS);
				
				if ( skin.fontShader != null ) {
					skin.fonts[i].material.shader = skin.fontShader;
				}
				
				skin.fonts[i].material.SetPass(0);

				for ( o = 0; o < labels.Length; o++ ) {
					w = labels[o];
					
					if ( w != null && w.styles.basic != null && w.styles.basic.text.fontIndex == i && w.isDrawn ) {
						w.DrawGL ();
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
			if ( textures != null && textures.Length > 0 ) {
				GL.Begin(GL.QUADS);
				for ( i = 0; i < textures.Length; i++ ) {	
					if ( textures[i].mainTexture != null ) {
						textureMaterial.mainTexture = textures[i].mainTexture;
						textureMaterial.SetPass(0);
						textures[i].DrawGL();
					}
				}

				GL.End();
			}


			GL.PopMatrix();
		}
	}
	
	public function ReleaseWidget () {
		downWidget = null;
	
		SetDirty ();
	}

	public function SetDirty ( frames : int ) {
		dirtyCounter = frames;
	}

	public function SetDirty () {
		SetDirty ( 2 );
	}

	public function Start () {
		if ( currentPage != null && Application.isPlaying ) {
			currentPage.StartPage ();
		}

		UpdateWidgets ();
	}

	public function Update () {
		if ( instance == null ) {
			instance = this;
		}

		if ( textureMaterial == null && skin != null && skin.atlas != null ) {
			textureMaterial = new Material ( skin.atlas.shader );
		
		} else if ( skin != null && skin.atlas != null && textureMaterial.shader != skin.atlas.shader ) {
			textureMaterial.shader = skin.atlas.shader;

		}

		// Only update these when playing
		if ( Application.isPlaying && currentPage != null ) {
			// Current page
			currentPage.UpdatePage ();

			// Mouse interaction
			UpdateMouse ();	
		}

		// Update all widgets
		if ( dirtyCounter > 0 ) {
			texWidth = skin.atlas.mainTexture.width;
			texHeight = skin.atlas.mainTexture.height;

			UpdateWidgets ();
			dirtyCounter--;
		}
	}

	public function UpdateMouse () {
		if ( widgets == null ) { return; }
		
		var i : int = 0;
		var w : OGWidget;

		// Check all widgets
		mouseOver.Clear ();

		for ( i = 0; i < widgets.Length; i++ ) {
			w = widgets[i];
			
			if ( w.isDrawn && w.CheckMouseOver() ) {
				w.OnMouseOver ();
				mouseOver.Add ( w );
			}
		}

		// Is mouse over anything?
		isMouseOver = mouseOver.Count > 0;

		// Update mouse-over widgets
		for ( i = 0; i < mouseOver.Count; i++ ) {
			if ( mouseOver[i] != null ) {
				mouseOver[i].UpdateWidget ();
			}
		}

		// Click
		if ( Input.GetMouseButtonDown ( 0 ) ) {
			var topWidget : OGWidget;
			
			for ( i = 0; i < mouseOver.Count; i++ ) {
				w = mouseOver[i];
				
				if ( ( topWidget == null || w.transform.position.z < topWidget.transform.position.z ) && w.selectable ) {
					topWidget = w;
				}
			}
			
			if ( downWidget && downWidget != topWidget ) {
				downWidget.OnMouseCancel ();
			}
			
			if ( topWidget != null ) {
				topWidget.OnMouseDown ();
				downWidget = topWidget;
			}

		// Release
		} else if ( Input.GetMouseButtonUp ( 0 ) ) {
			if ( downWidget ) {
				downWidget.dragOffset = Vector3.zero;

				if ( downWidget.CheckMouseOver() ) {
					downWidget.OnMouseUp ();

				} else {
					downWidget.OnMouseCancel ();
				
				}
			
			}
		
		// Dragging
		} else if ( Input.GetMouseButton ( 0 ) || Input.GetMouseButton ( 2 ) ) {
			if ( downWidget ) {
				downWidget.OnMouseDrag ();
			
				if ( downWidget.isDraggable ) {
					var mousePos : Vector3 = Input.mousePosition;
					mousePos.y = Screen.height - mousePos.y;

					if ( downWidget.dragOffset == Vector3.zero ) {
						downWidget.dragOffset = downWidget.transform.position - mousePos;
					}

					var newPos : Vector3 = downWidget.transform.position;
					newPos = mousePos + downWidget.dragOffset;
					downWidget.transform.position = newPos;
					SetDirty ();
					//downWidget.Recalculate ();
				}
			}
		
		// Escape key
		} else if ( Input.GetKeyDown ( KeyCode.Escape ) ) {
			if ( downWidget ) {
				downWidget.OnMouseCancel ();
				ReleaseWidget ();
			}
		}
	}	


        public function Intersect ( w : Transform ) : boolean {
		var c1 : boolean = w.position.x + w.lossyScale.x > 0;
		var c2 : boolean = w.position.x < Screen.width;
		var c3 : boolean = w.position.y + w.lossyScale.y > 0;
		var c4 : boolean = w.position.y < Screen.height;
		return c1 && c2 && c3 && c4;
	}
    
	public function UpdateWidgets () {
		screenRect = new Rect ( 0, Screen.width, 0, Screen.height );

		if ( currentPage == null ) { return; }
		
		// Index font unicode
		if ( unicode == null || unicode.Length != skin.fonts.Length ) {
			ReloadFonts ();
		}
	
		// Update widget lists	
		widgets = currentPage.gameObject.GetComponentsInChildren.<OGWidget>();
		labels = currentPage.gameObject.GetComponentsInChildren.<OGLabel>();
		textures = currentPage.gameObject.GetComponentsInChildren.<OGTexture>();

		for ( var i : int = 0; i < widgets.Length; i++ ) {
			var w : OGWidget = widgets[i];

			if ( w == null ) { continue; }
			
			w.root = this;			
			w.Recalculate ();
			w.UpdateWidget ();
		}
	}
}
