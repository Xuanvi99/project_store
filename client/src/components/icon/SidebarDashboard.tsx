function Product({ size }: { size?: number }) {
  return (
    <svg
      fill="currentColor"
      height={size || 25}
      width={size || 25}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 376.138 376.138"
      xmlSpace="preserve"
    >
      <g>
        <path
          d="M375.631,213.977c1.253-20.954-16.385-45.671-69.666-52.282c-17.238-2.14-33.983-7.308-49.077-13.569
		c-17.089,15.38-11.409,30.765-11.152,31.429c1.59,3.825-0.238,8.174-4.063,9.764c-0.932,0.387-1.898,0.57-2.85,0.57
		c-2.955,0-5.769-1.765-6.972-4.658c-0.41-0.988-8.967-22.445,10.414-43.716c-8.226-4.025-15.732-8.207-22.273-12.141
		c-22.953,16.849-15.866,34.858-15.787,35.05c1.591,3.825-0.222,8.214-4.046,9.804c-0.941,0.392-1.917,0.577-2.876,0.577
		c-2.939,0-5.73-1.739-6.929-4.623c-4.068-9.787-4.834-31.1,16.279-49.319c-8.61-5.808-13.67-9.886-13.848-10.03
		c-17.964-14.395-26.042-19.015-33.243-19.015c-8.768,0-12.913,6.812-16.923,13.4c-4.132,6.789-9.79,16.086-22.753,25.099
		c-9.498,6.602-19.393,9.951-29.411,9.952c-0.003,0-0.002,0-0.005,0c-25.266,0-46.428-20.686-56.792-33.016
		c-1.472-1.751-3.658-2.748-5.949-2.671c-2.286,0.063-4.419,1.166-5.792,2.996C4.037,131.416-3.114,163.258,1.242,199.663
		c2.724,22.775,9.066,40.525,11.222,46.085l-1.994,30.406c-0.187,2.096,0.517,4.175,1.936,5.728
		c1.421,1.553,3.429,2.438,5.534,2.438h297.9c21.565,0,37.785-12.226,48.212-24.503C379.009,242.2,376.036,216.697,375.631,213.977z
		 M352.618,248.106c-7.444,8.767-19.818,21.212-36.777,21.212H26.137l0.818-17.195l302.085-0.19c9.462,0,18.286-2.426,25.662-6.598
		C354.068,246.282,353.379,247.209,352.618,248.106z"
        />
      </g>
    </svg>
  );
}

function Comment({ size }: { size?: number }) {
  return (
    <svg
      fill="currentColor"
      height={size || 25}
      width={size || 25}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 60 60"
      xmlSpace="preserve"
    >
      <path
        d="M54,2H6C2.748,2,0,4.748,0,8v33c0,3.252,2.748,6,6,6h28.558l9.702,10.673C44.453,57.885,44.724,58,45,58
 c0.121,0,0.243-0.022,0.36-0.067C45.746,57.784,46,57.413,46,57V47h8c3.252,0,6-2.748,6-6V8C60,4.748,57.252,2,54,2z M12,15h15
 c0.553,0,1,0.448,1,1s-0.447,1-1,1H12c-0.553,0-1-0.448-1-1S11.447,15,12,15z M46,33H12c-0.553,0-1-0.448-1-1s0.447-1,1-1h34
 c0.553,0,1,0.448,1,1S46.553,33,46,33z M46,25H12c-0.553,0-1-0.448-1-1s0.447-1,1-1h34c0.553,0,1,0.448,1,1S46.553,25,46,25z"
      />
    </svg>
  );
}

const Dashboard = ({ size }: { size?: number }) => {
  return (
    <svg
      width={size || 25}
      height={size || 25}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 4.5C1 1.87479 1.02811 1 4.5 1C7.97189 1 8 1.87479 8 4.5C8 7.12521 8.01107 8 4.5 8C0.988927 8 1 7.12521 1 4.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 4.5C12 1.87479 12.0281 1 15.5 1C18.9719 1 19 1.87479 19 4.5C19 7.12521 19.0111 8 15.5 8C11.9889 8 12 7.12521 12 4.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 15.5C1 12.8748 1.02811 12 4.5 12C7.97189 12 8 12.8748 8 15.5C8 18.1252 8.01107 19 4.5 19C0.988927 19 1 18.1252 1 15.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 15.5C12 12.8748 12.0281 12 15.5 12C18.9719 12 19 12.8748 19 15.5C19 18.1252 19.0111 19 15.5 19C11.9889 19 12 18.1252 12 15.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

function Purchase({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="currentColor"
      version="1.1"
      id="Capa_1"
      width={size}
      height={size}
      viewBox="0 0 406.985 406.985"
      xmlSpace="preserve"
    >
      <g>
        <path d="M349.176,0H74.194C56.342,0,41.823,14.523,41.823,32.375v25.614c-9.166,0.884-16.382,8.544-16.382,17.94   c0,9.398,7.216,17.05,16.382,17.937v20.581c-9.166,0.892-16.382,8.544-16.382,17.942c0,9.396,7.216,17.051,16.382,17.937v21.93   c-9.166,0.886-16.382,8.542-16.382,17.937c0,9.398,7.216,17.051,16.382,17.94v20.586c-9.166,0.885-16.382,8.541-16.382,17.937   c0,9.401,7.216,17.051,16.382,17.948v20.301c-9.166,0.892-16.382,8.548-16.382,17.942c0,9.396,7.216,17.052,16.382,17.938v53.827   c0,17.854,14.526,32.372,32.371,32.372h274.982c17.85,0,32.367-14.522,32.367-32.372V32.37C381.543,14.523,367.026,0,349.176,0z    M41.818,311.532c-4.062-0.808-7.132-4.399-7.132-8.694c0-4.296,3.07-7.886,7.132-8.689V311.532z M41.818,255.345   c-4.062-0.81-7.132-4.399-7.132-8.689c0-4.296,3.07-7.879,7.132-8.689V255.345z M41.818,198.882   c-4.062-0.81-7.132-4.396-7.132-8.689c0-4.298,3.07-7.885,7.132-8.689V198.882z M41.818,141.074   c-4.062-0.808-7.132-4.392-7.132-8.685c0-4.298,3.07-7.885,7.132-8.692V141.074z M41.818,84.616   c-4.062-0.812-7.132-4.394-7.132-8.692c0-4.298,3.07-7.882,7.132-8.689V84.616z M363.048,374.613   c0,7.644-6.229,13.871-13.872,13.871H74.194c-7.648,0-13.873-6.228-13.873-13.871v-53.658h13.71   c1.598,6.178,7.155,10.758,13.841,10.758c7.921,0,14.343-6.419,14.343-14.335c0-7.925-6.422-14.349-14.343-14.349   c-5.907,0-10.971,3.572-13.167,8.672H60.322v-46.934h13.71c1.598,6.185,7.155,10.765,13.841,10.765   c7.921,0,14.343-6.419,14.343-14.343c0-7.923-6.422-14.348-14.343-14.348c-5.907,0-10.971,3.568-13.167,8.667H60.322v-47.2h14.131   c2.011,5.483,7.24,9.422,13.42,9.422c7.921,0,14.343-6.421,14.343-14.347c0-7.924-6.422-14.344-14.343-14.344   c-6.404,0-11.767,4.223-13.611,10.018h-13.94v-48.559h13.772c1.664,6.081,7.171,10.575,13.779,10.575   c7.921,0,14.343-6.422,14.343-14.345s-6.422-14.344-14.343-14.344c-5.981,0-11.094,3.663-13.247,8.864H60.322V94.034h13.373   c0.824,7.135,6.821,12.698,14.178,12.698c7.921,0,14.343-6.421,14.343-14.345c0-7.923-6.422-14.344-14.343-14.344   c-5.122,0-9.584,2.7-12.12,6.741H60.322V32.37c0-7.647,6.224-13.875,13.873-13.875h274.982c7.643,0,13.872,6.228,13.872,13.875   V374.613z M328.077,83.249c0,3.833-3.104,6.936-6.938,6.936H139.233c-3.833,0-6.938-3.103-6.938-6.936   c0-3.833,3.105-6.938,6.938-6.938h181.905C324.972,76.304,328.077,79.41,328.077,83.249z M305.726,139.517   c0,3.833-3.105,6.936-6.938,6.936H161.584c-3.833,0-6.937-3.103-6.937-6.936c0-3.833,3.104-6.938,6.937-6.938h137.203   C302.621,132.573,305.726,135.678,305.726,139.517z M305.726,196.554c0,3.83-3.105,6.936-6.938,6.936H161.584   c-3.833,0-6.937-3.106-6.937-6.936c0-3.833,3.104-6.938,6.937-6.938h137.203C302.621,189.616,305.726,192.721,305.726,196.554z    M305.726,252.051c0,3.835-3.105,6.938-6.938,6.938H161.584c-3.833,0-6.937-3.104-6.937-6.938c0-3.831,3.104-6.934,6.937-6.934   h137.203C302.621,245.113,305.726,248.215,305.726,252.051z M305.726,311.018c0,3.829-3.105,6.938-6.938,6.938H161.584   c-3.833,0-6.937-3.109-6.937-6.938c0-3.832,3.104-6.938,6.937-6.938h137.203C302.621,304.08,305.726,307.186,305.726,311.018z" />
      </g>
    </svg>
  );
}

function Message({ size }: { size: number }) {
  return (
    <svg
      fill="currentColor"
      height={size}
      width={size}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 423.789 423.789"
      xmlSpace="preserve"
    >
      <path
        d="M423.789,225.29c0-52.537-50.816-95.767-116.583-100.102c-7.191-9.469-15.979-18.275-26.273-26.207
	c-31.04-23.916-72.165-37.086-115.8-37.086c-43.634,0-84.759,13.171-115.799,37.086C17.521,123.492,0,156.321,0,191.42
	c0,55.275,44.811,104.246,110.372,122.249c-3.909,6.604-11.674,16.833-26.906,29.81c-2.959,2.521-4.189,6.53-3.153,10.277
	c1.036,3.748,4.151,6.554,7.985,7.197c0.575,0.097,5.865,0.941,14.5,0.941c0.001,0,0.001,0,0.002,0
	c23.175,0,67.583-6.021,107.382-45.818c6.59-1.457,12.992-3.22,19.185-5.264c9.889,4.816,20.515,8.524,31.686,11.048
	c30.757,30.437,64.927,34.909,82.347,34.909c6.711-0.001,10.939-0.664,11.525-0.762c3.834-0.643,6.949-3.45,7.985-7.197
	c1.036-3.747-0.193-7.755-3.153-10.277c-9.412-8.02-14.932-14.569-18.141-19.272C390.578,304.654,423.789,267.339,423.789,225.29z
	 M210.133,228.895h-90c-5.523,0-10-4.477-10-10s4.477-10,10-10h90c5.523,0,10,4.477,10,10S215.656,228.895,210.133,228.895z
	 M240.133,179.561h-150c-5.523,0-10-4.477-10-10c0-5.523,4.477-10,10-10h150c5.523,0,10,4.477,10,10
	C250.133,175.084,245.656,179.561,240.133,179.561z M325.373,302.767c-5.051,1.065-8.461,5.799-7.871,10.927
	c0.224,1.946,1.705,9.83,11.347,21.917c-15.384-2.515-36.304-9.878-55.581-29.844c-1.401-1.451-3.208-2.445-5.184-2.85
	c-4.193-0.86-8.289-1.921-12.288-3.155c45.494-23.441,74.471-63.779,74.471-108.342c0-15.473-3.409-30.503-9.942-44.576
	c20.77,3.551,39.708,11.696,54.598,23.678c18.615,14.979,28.867,34.429,28.867,54.768
	C403.789,261.171,371.543,293.03,325.373,302.767z"
      />
    </svg>
  );
}

function Inventory({ size }: { size: number }) {
  return (
    <svg
      fill="currentColor"
      height={size}
      width={size}
      version="1.2"
      baseProfile="tiny"
      id="inventory"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 256 230"
      xmlSpace="preserve"
    >
      <path
        d="M61.2,106h37.4v31.2H61.2V106z M61.2,178.7h37.4v-31.2H61.2V178.7z M61.2,220.1h37.4v-31.2H61.2V220.1z M109.7,178.7H147
 v-31.2h-37.4V178.7z M109.7,220.1H147v-31.2h-37.4V220.1z M158.2,188.9v31.2h37.4v-31.2H158.2z M255,67.2L128.3,7.6L1.7,67.4
 l7.9,16.5l16.1-7.7v144h18.2V75.6h169v144.8h18.2v-144l16.1,7.5L255,67.2z"
      />
    </svg>
  );
}

export { Product, Comment, Dashboard, Purchase, Message, Inventory };
