Shader "Unlit/Vertex Colored" {
	Properties {
		_MainTex ("Texture", 2D) = "white" {}
	}

	Category {
		Lighting Off
		Blend SrcAlpha OneMinusSrcAlpha
		Tags { "Queue"="Geometry" }
		
		BindChannels {
			Bind "Color", color
			Bind "Vertex", vertex
			Bind "TexCoord", texcoord
		}
		
		SubShader {
			Pass {
				SetTexture [_MainTex] {
					Combine Texture * primary
				}
			}
		}
	}
}
