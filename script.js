// ===== ИНИЦИАЛИЗАЦИЯ AOS АНИМАЦИЙ =====
AOS.init({
	duration: 500,
	once: true, // анимация проигрывается 1 раз
	throttleDelay: 99, // реже проверяем позицию скролла
	disable: 'mobile' // отключаем на мобилках (где больше всего тормозов)
})

// ===== ПЛАВНАЯ ПРОКРУТКА ПО ЯКОРЯМ =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault()

		const targetId = this.getAttribute('href')
		const targetSection = document.querySelector(targetId)

		if (targetSection) {
			const headerHeight = 80
			const targetPosition = targetSection.offsetTop - headerHeight

			window.scrollTo({
				top: targetPosition,
				behavior: 'smooth'
			})
		}
	})
})

// ===== МОДАЛЬНОЕ ОКНО С ЗУМОМ =====
const modal = document.getElementById('portfolioModal')
const modalImg = document.getElementById('modalImg')
const closeBtn = document.querySelector('.close')
const zoomInBtn = document.getElementById('zoomInBtn')
const zoomOutBtn = document.getElementById('zoomOutBtn')

let currentZoom = 1
const ZOOM_STEP = 0.2
const MIN_ZOOM = 0.5
const MAX_ZOOM = 3

// Получить полное изображение из карточки
function getFullImageFromCard(card) {
	let fullImg = card.querySelector('.full-img')
	if (fullImg && fullImg.src) {
		return fullImg.src
	}
	let previewImg = card.querySelector('.preview-img')
	if (previewImg && previewImg.src) {
		return previewImg.src
	}
	return null
}

// Открытие модального окна
function openModal(imgSrc) {
	if (!imgSrc) return
	modalImg.src = imgSrc
	modalImg.style.transform = 'scale(1)'
	currentZoom = 1
	modal.style.display = 'flex'
	setTimeout(() => {
		modal.classList.add('active')
	}, 10)
	document.body.style.overflow = 'hidden'
}

// Закрытие модального окна
function closeModal() {
	modal.classList.remove('active')
	setTimeout(() => {
		if (!modal.classList.contains('active')) {
			modal.style.display = 'none'
			document.body.style.overflow = ''
		}
	}, 300)
}

// Зум
function zoomIn() {
	if (currentZoom < MAX_ZOOM) {
		currentZoom += ZOOM_STEP
		modalImg.style.transform = `scale(${currentZoom})`
	}
}

function zoomOut() {
	if (currentZoom > MIN_ZOOM) {
		currentZoom -= ZOOM_STEP
		modalImg.style.transform = `scale(${currentZoom})`
	}
}

// Обработчики для карточек портфолио
document.querySelectorAll('.portfolio-item').forEach(card => {
	card.addEventListener('click', function (e) {
		if (e.target.closest('.modal')) return
		const fullImgSrc = getFullImageFromCard(this)
		if (fullImgSrc) {
			openModal(fullImgSrc)
		}
	})
})

// Закрытие по крестику
if (closeBtn) {
	closeBtn.addEventListener('click', closeModal)
}

// Закрытие по клику на фон (но НЕ на картинку)
modal.addEventListener('click', function (e) {
	if (
		e.target === modal ||
		e.target === document.querySelector('.modal-body')
	) {
		closeModal()
	}
})

// Закрытие по ESC
document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape' && modal.style.display === 'flex') {
		closeModal()
	}
})

// Кнопки зума
if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn)
if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut)

// ===== КНОПКА "ЗАГРУЗИТЬ ЕЩЁ" =====
document.addEventListener('DOMContentLoaded', function () {
	const allItems = document.querySelectorAll('.portfolio-item')
	const moreBtn = document.getElementById('showMoreBtn')

	if (!moreBtn) {
		return
	}

	// Если карточек 6 или меньше — кнопка не нужна
	if (allItems.length <= 6) {
		moreBtn.classList.add('hidden')
		return
	}

	// Скрываем карточки, начиная с 7-й
	allItems.forEach((item, index) => {
		if (index >= 6) {
			item.classList.add('hidden')
		}
	})

	moreBtn.addEventListener('click', function () {
		const hiddenItems = document.querySelectorAll('.portfolio-item.hidden')

		if (hiddenItems.length === 0) {
			this.classList.add('hidden')
			return
		}

		// Показываем следующие 6 (или сколько осталось)
		const toShow = Math.min(6, hiddenItems.length)

		for (let i = 0; i < toShow; i++) {
			const item = hiddenItems[i]
			item.classList.remove('hidden')
			setTimeout(() => {
				item.classList.add('show')
			}, i * 120)
		}

		// После показа всех, проверяем, остались ли ещё скрытые
		setTimeout(
			() => {
				const remaining = document.querySelectorAll('.portfolio-item.hidden')
				if (remaining.length === 0) {
					moreBtn.classList.add('hidden')
				}
			},
			toShow * 120 + 300
		)
	})
}) // ===== БУРГЕР-МЕНЮ =====
const burger = document.querySelector('.burger')
const navMenu = document.querySelector('.nav-menu')

if (burger && navMenu) {
	burger.addEventListener('click', () => {
		burger.classList.toggle('active')
		navMenu.classList.toggle('active')
		document.body.style.overflow = navMenu.classList.contains('active')
			? 'hidden'
			: ''
	})

	navMenu.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', () => {
			burger.classList.remove('active')
			navMenu.classList.remove('active')
			document.body.style.overflow = ''
		})
	})
}

// ===== FAQ АККОРДЕОН =====
const faqItems = document.querySelectorAll('.faq-item')

faqItems.forEach(item => {
	const question = item.querySelector('.faq-question')
	if (!question) return

	question.addEventListener('click', () => {
		const isActive = item.classList.contains('active')

		// Закрываем все остальные
		faqItems.forEach(other => other.classList.remove('active'))

		// Открываем текущий, если был закрыт
		if (!isActive) {
			item.classList.add('active')
		}
	})
})
// ===== БЕСКОНЕЧНАЯ КАРУСЕЛЬ ОТЗЫВОВ =====
document.addEventListener('DOMContentLoaded', function () {
	const track = document.querySelector('.reviews-track')
	const originalSlides = Array.from(document.querySelectorAll('.review-slide'))
	const prevBtn = document.querySelector('.reviews-arrow--prev')
	const nextBtn = document.querySelector('.reviews-arrow--next')
	const dotsContainer = document.querySelector('.reviews-dots')

	if (!track || originalSlides.length === 0) return

	let currentIndex = 0
	let isAnimating = false
	const total = originalSlides.length
	let visibleCount = getVisibleCount()

	// Сколько слайдов видно
	function getVisibleCount() {
		if (window.innerWidth <= 1024) return 1
		return 2
	}

	// Клонируем слайды по краям для бесконечности
	function setupClones() {
		// Удаляем старые клоны, если есть
		track.querySelectorAll('.review-slide.clone').forEach(el => el.remove())

		const slides = Array.from(
			track.querySelectorAll('.review-slide:not(.clone)')
		)

		// Клоны в конец (первые visibleCount штук)
		for (let i = 0; i < visibleCount; i++) {
			const clone = slides[i].cloneNode(true)
			clone.classList.add('clone')
			track.appendChild(clone)
		}

		// Клоны в начало (последние visibleCount штук) — в обратном порядке
		for (let i = visibleCount - 1; i >= 0; i--) {
			const clone = slides[slides.length - 1 - i].cloneNode(true)
			clone.classList.add('clone')
			track.insertBefore(clone, track.firstChild)
		}
	}

	// Ширина одного слайда + gap
	function getSlideStep() {
		const slide = track.querySelector('.review-slide')
		const style = window.getComputedStyle(track)
		const gap = parseFloat(style.gap) || 24
		return slide.getBoundingClientRect().width + gap
	}

	// Установка позиции без анимации
	function setPosition(offset) {
		track.style.transition = 'none'
		track.style.transform = `translateX(-${offset}px)`
		// Форсируем reflow
		void track.offsetWidth
		track.style.transition = ''
	}

	// Установка позиции с анимацией
	function animateTo(offset) {
		track.style.transform = `translateX(-${offset}px)`
	}

	// Позиция с учётом клонов
	function getOffsetForIndex(index) {
		const step = getSlideStep()
		return (index + visibleCount) * step
	}

	// Обновить точки
	function updateDots() {
		const dots = dotsContainer.querySelectorAll('.reviews-dot')
		let realIndex = currentIndex

		// Приводим к диапазону [0, total)
		realIndex = ((realIndex % total) + total) % total

		dots.forEach((dot, i) => {
			dot.classList.toggle('active', i === realIndex)
		})
	}

	// Создать точки
	function buildDots() {
		dotsContainer.innerHTML = ''
		for (let i = 0; i < total; i++) {
			const dot = document.createElement('button')
			dot.className = 'reviews-dot' + (i === 0 ? ' active' : '')
			dot.setAttribute('aria-label', `Отзыв ${i + 1}`)
			dot.addEventListener('click', () => {
				if (isAnimating) return
				currentIndex = i
				animateTo(getOffsetForIndex(currentIndex))
				updateDots()
			})
			dotsContainer.appendChild(dot)
		}
	}

	// Следующий
	function next() {
		if (isAnimating) return
		isAnimating = true
		currentIndex++
		animateTo(getOffsetForIndex(currentIndex))
		updateDots()
	}

	// Предыдущий
	function prev() {
		if (isAnimating) return
		isAnimating = true
		currentIndex--
		animateTo(getOffsetForIndex(currentIndex))
		updateDots()
	}

	// После окончания анимации — телепорт, если на клоне
	track.addEventListener('transitionend', () => {
		isAnimating = false

		// Если ушли за пределы оригинала справа
		if (currentIndex >= total) {
			currentIndex -= total
			setPosition(getOffsetForIndex(currentIndex))
			updateDots()
		}

		// Если ушли за пределы оригинала слева
		if (currentIndex < 0) {
			currentIndex += total
			setPosition(getOffsetForIndex(currentIndex))
			updateDots()
		}
	})

	// Кнопки
	nextBtn.addEventListener('click', next)
	prevBtn.addEventListener('click', prev)

	// Свайпы
	let touchStartX = 0
	let touchEndX = 0

	track.addEventListener('touchstart', e => {
		touchStartX = e.changedTouches[0].screenX
	})

	track.addEventListener('touchend', e => {
		touchEndX = e.changedTouches[0].screenX
		const diff = touchStartX - touchEndX
		if (Math.abs(diff) < 50) return
		if (diff > 0) next()
		else prev()
	})

	// Клавиатура
	document.addEventListener('keydown', e => {
		if (e.key === 'ArrowLeft') prev()
		if (e.key === 'ArrowRight') next()
	})

	// Инициализация
	function init() {
		visibleCount = getVisibleCount()
		setupClones()
		currentIndex = 0
		setPosition(getOffsetForIndex(currentIndex))
		buildDots()
	}

	init()

	// Ресайз
	let resizeTimer
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer)
		resizeTimer = setTimeout(() => {
			init()
		}, 200)
	})
})
