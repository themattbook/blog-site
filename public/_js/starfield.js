const canvas = document.getElementById('starfield');
const context = canvas.getContext('2d');
const screenW = window.innerWidth;
const screenH = window.innerHeight;
const numStars = 14;
const stars = [];

const connections = 8; // Number of stars to connect

canvas.width = screenW;
canvas.height = screenH;

for (let i = 0; i < numStars; i++) {
	const x = Math.round(Math.random() * screenW);
	const y = Math.round(Math.random() * screenH);
	const radius = 1 + Math.random() / 2;
	const opacity = Math.random();
	const increment = Math.random() * 0.005; // Adjusted increment for slower fade

	stars.push({ x, y, radius, opacity, increment, factor: 1 });
}

// Function to check if a line intersects with any existing line
function doesIntersect(line1, line2) {
	const [x1, y1, x2, y2] = line1;
	const [x3, y3, x4, y4] = line2;

	const a = (x1 - x2) * (y3 - y1) - (x3 - x1) * (y1 - y2);
	const b = (x1 - x2) * (y3 - y4) - (x3 - x4) * (y1 - y2);
	const c = (x3 - x4) * (y3 - y1) - (x1 - x2) * (y3 - y4);

	const d = b !== 0 ? a / b : 0;

	return d >= 0 && d <= 1 && (a !== 0 || b !== 0);
}

// Function to create random constellations without intersecting lines
function createConstellation() {
	const starIndices = [];
	let attempts = 0;

	while (starIndices.length < connections && attempts < 100) {
		const index = Math.floor(Math.random() * numStars);
		const newLine = [stars[index].x, stars[index].y];

		let valid = true;
		for (let i = 0; i < starIndices.length; i++) {
			const line = [stars[starIndices[i]].x, stars[starIndices[i]].y];
			if (doesIntersect(newLine, line)) {
				valid = false;
				break;
			}
		}

		if (valid) {
			starIndices.push(index);
		} else {
			attempts++;
		}
	}

	return starIndices;
}

// Create constellations
const constellationsList = [];
for (let i = 0; i < 1; i++) {
	constellationsList.push(createConstellation());
}

function drawStar(star) {
	context.save();

	if (star.opacity > 1) {
		star.factor = -1;
	} else if (star.opacity <= 0) {
		star.factor = 1;
	}

	star.opacity += star.increment * star.factor;

	context.globalAlpha = star.opacity;
	context.fillStyle = `rgba(255, 255, 255, 1)`;
	context.shadowBlur = 5;
	context.shadowColor = '#33eeff';
	context.beginPath();
	context.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
	context.closePath();
	context.fill();

	context.restore();
}

function drawLines() {
	context.beginPath();
	const constellation =
		constellationsList[
			Math.floor(Math.random() * constellationsList.length)
		];
	constellation.forEach((index, i) => {
		const star = stars[index];
		if (i === 0) {
			context.moveTo(star.x, star.y);
		} else {
			context.lineTo(star.x, star.y);
		}
	});
	context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
	context.stroke();
}

function animate() {
	context.clearRect(0, 0, screenW, screenH);
	stars.forEach(drawStar);
	drawLines();
	requestAnimationFrame(animate);
}

animate();
