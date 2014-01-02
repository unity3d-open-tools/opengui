Shader "GUI/Alpha Sliced" {
	Properties {
		_MainTex ("Texture", 2D) = "white" {}
		_ClipRect ( "Clipping", Vector ) = ( 0, 0, 0, 0 )
		_Color ("Color", Color ) = (1,1,1,1)
	}

	SubShader {
		Tags {
			"RenderType"="Transparent"
			"Queue"="Transparent"
			"IgnoreProjector"="True"
		}

		LOD 200
		Lighting Off
		Blend SrcAlpha OneMinusSrcAlpha

		Pass {
			CGPROGRAM
				#pragma exclude_renderers d3d11 xbox360
				#pragma vertex vert
				#pragma fragment frag
				#include "UnityCG.cginc"
			
				struct v2f {
					float4 pos : SV_POSITION;
					float2 uv_MainTex : TEXCOORD0;
					float3 wpos;
				};
			
				float4 _MainTex_ST;
				float4 _ClipRect;
				float4 _Color;
			
				v2f vert(appdata_base v) {
					v2f o;
					o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
					o.uv_MainTex = TRANSFORM_TEX(v.texcoord, _MainTex);
					o.wpos = mul(_Object2World, v.vertex);
					return o;
				}
			
				sampler2D _MainTex;
			
				float4 frag(v2f IN) : COLOR {
					if ( (IN.wpos.x<_ClipRect.x) || (IN.wpos.x>_ClipRect.y) || (IN.wpos.y<_ClipRect.z) || (IN.wpos.y>_ClipRect.w) ) {
						half4 colorTransparent = half4(0,0,0,0);
						return colorTransparent;
					} else {
						half4 c = tex2D (_MainTex, IN.uv_MainTex);
						return c;
					}
				}
			ENDCG
		}
	} 	
}
