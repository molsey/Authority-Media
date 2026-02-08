// ─── Mobile Menu Toggle ───
let menuOpen = false

function toggleMenu() {
  const menu = document.getElementById('mobile-menu')
  const icon = document.getElementById('menu-icon')
  const btn = document.getElementById('mobile-menu-btn')
  if (!menu || !icon) return

  menuOpen = !menuOpen

  if (menuOpen) {
    menu.style.maxHeight = menu.scrollHeight + 'px'
    icon.setAttribute('icon', 'solar:close-circle-linear')
    if (btn) btn.setAttribute('aria-expanded', 'true')
  } else {
    menu.style.maxHeight = '0'
    icon.setAttribute('icon', 'solar:hamburger-menu-linear')
    if (btn) btn.setAttribute('aria-expanded', 'false')
  }
}

function closeMenu() {
  const menu = document.getElementById('mobile-menu')
  const icon = document.getElementById('menu-icon')
  const btn = document.getElementById('mobile-menu-btn')
  if (!menu || !menuOpen) return

  menuOpen = false
  menu.style.maxHeight = '0'
  if (icon) icon.setAttribute('icon', 'solar:hamburger-menu-linear')
  if (btn) btn.setAttribute('aria-expanded', 'false')
}

window.toggleMenu = toggleMenu

// ─── FAQ Accordion Toggle ───
function toggleFaq(el) {
  const content = el.nextElementSibling
  const icon = el.querySelector('.faq-icon')
  if (!content) return

  const isOpen = !content.classList.contains('hidden')

  // Close all FAQ items
  document.querySelectorAll('.faq-content').forEach(item => {
    item.classList.add('hidden')
    item.style.maxHeight = null
  })
  document.querySelectorAll('.faq-icon').forEach(ic => {
    ic.style.transform = 'rotate(0deg)'
  })

  // Open clicked item if it was closed
  if (!isOpen) {
    content.classList.remove('hidden')
    content.style.maxHeight = content.scrollHeight + 'px'
    if (icon) icon.style.transform = 'rotate(45deg)'
  }
}
window.toggleFaq = toggleFaq

// ─── Transcript Tab Switching ───
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('text-white', 'border-orange-500')
    btn.classList.add('text-neutral-400', 'border-transparent')
  })
  document.querySelectorAll('.tab-content').forEach(panel => {
    panel.classList.add('hidden')
  })

  const activeBtn = document.querySelector(`[data-tab="${tabName}"]`)
  const activePanel = document.getElementById(`tab-${tabName}`)
  if (activeBtn) {
    activeBtn.classList.remove('text-neutral-400', 'border-transparent')
    activeBtn.classList.add('text-white', 'border-orange-500')
  }
  if (activePanel) {
    activePanel.classList.remove('hidden')
  }
}
window.switchTab = switchTab

// ─── Audio Player ───
class AudioPlayer {
  constructor({ mode }) {
    this.audio = new Audio()
    this.audio.preload = 'metadata'
    this.mode = mode
    this.isPlaying = false
    this.currentEpisode = null
    this.queue = []
    this.queueIndex = 0

    this.dom = {}
    this.bindDOM()
    this.bindAudioEvents()
    this.bindUIEvents()
  }

  bindDOM() {
    if (this.mode === 'listing') {
      this.dom = {
        playBtn: document.getElementById('player-play-btn'),
        playIcon: document.getElementById('player-play-icon'),
        progressBar: document.getElementById('player-progress-bar'),
        progressFill: document.getElementById('player-progress-fill'),
        timeDisplay: document.getElementById('player-time'),
        rewindBtn: document.getElementById('player-rewind-btn'),
        forwardBtn: document.getElementById('player-forward-btn'),
        speedBtn: document.getElementById('player-speed-btn'),
        volumeBtn: document.getElementById('player-volume-btn'),
        visualizer: document.getElementById('visualizer'),
      }
    } else {
      this.dom = {
        playBtn: document.getElementById('single-play-btn'),
        playIcon: document.getElementById('single-play-icon'),
        progressBar: document.getElementById('single-progress-bar'),
        progressFill: document.getElementById('single-progress-fill'),
        currentTime: document.getElementById('single-current-time'),
        duration: document.getElementById('single-duration'),
        rewindBtn: document.getElementById('single-rewind-btn'),
        forwardBtn: document.getElementById('single-forward-btn'),
        speedBtn: document.getElementById('single-speed-btn'),
        nowPlayingThumb: document.getElementById('single-ep-thumb'),
        nowPlayingTitle: document.getElementById('single-ep-title'),
        nowPlayingNumber: document.getElementById('single-ep-number'),
      }
    }
  }

  bindAudioEvents() {
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration())
    this.audio.addEventListener('timeupdate', () => this.updateProgress())
    this.audio.addEventListener('ended', () => {
      if (this.mode === 'listing') {
        this.playNext()
      } else {
        this.pause()
        this.audio.currentTime = 0
        this.updateProgress()
      }
    })
    this.audio.addEventListener('play', () => {
      this.isPlaying = true
      this.syncVisualizerState()
      this.updatePlayPauseIcon()
    })
    this.audio.addEventListener('pause', () => {
      this.isPlaying = false
      this.syncVisualizerState()
      this.updatePlayPauseIcon()
    })
  }

  bindUIEvents() {
    if (this.dom.playBtn) {
      this.dom.playBtn.addEventListener('click', () => this.togglePlayPause())
    }
    if (this.dom.progressBar) {
      this.dom.progressBar.addEventListener('pointerdown', (e) => {
        const rect = this.dom.progressBar.getBoundingClientRect()
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
        this.seekTo(percent)
      })
    }
    if (this.dom.rewindBtn) {
      this.dom.rewindBtn.addEventListener('click', () => this.skip(-15))
    }
    if (this.dom.forwardBtn) {
      this.dom.forwardBtn.addEventListener('click', () => this.skip(15))
    }
    if (this.dom.speedBtn) {
      this.dom.speedBtn.addEventListener('click', () => this.cycleSpeed())
    }
    if (this.dom.volumeBtn) {
      this.dom.volumeBtn.addEventListener('click', () => this.toggleMute())
    }
  }

  loadEpisode(episode) {
    this.currentEpisode = episode
    this.audio.src = episode.audioUrl
    this.audio.load()
    // If metadata already cached, update immediately
    if (this.audio.readyState >= 1) {
      this.updateDuration()
    }
    // Update now-playing info (single page)
    if (this.dom.nowPlayingThumb) {
      this.dom.nowPlayingThumb.src = episode.image
      this.dom.nowPlayingThumb.alt = episode.name
    }
    if (this.dom.nowPlayingTitle) this.dom.nowPlayingTitle.textContent = episode.name
    if (this.dom.nowPlayingNumber) this.dom.nowPlayingNumber.textContent = 'Episode ' + episode.episodeNumber
  }

  play() {
    if (!this.audio.src) return
    this.audio.play()
  }

  pause() {
    this.audio.pause()
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  seekTo(percent) {
    if (!this.audio.duration) return
    this.audio.currentTime = percent * this.audio.duration
  }

  skip(seconds) {
    this.audio.currentTime = Math.max(0, Math.min(this.audio.duration || 0, this.audio.currentTime + seconds))
  }

  setQueue(episodes) {
    this.queue = episodes
    this.queueIndex = 0
  }

  playFromQueue(index) {
    if (index < 0 || index >= this.queue.length) return
    this.queueIndex = index
    this.loadEpisode(this.queue[index])
    this.play()
  }

  playNext() {
    if (this.queueIndex < this.queue.length - 1) {
      this.queueIndex++
      this.loadEpisode(this.queue[this.queueIndex])
      renderLatestEpisode(this.queue[this.queueIndex])
      this.play()
    } else {
      this.pause()
    }
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted
    const icon = this.dom.volumeBtn?.querySelector('iconify-icon')
    if (icon) {
      icon.setAttribute('icon', this.audio.muted ? 'solar:volume-cross-linear' : 'solar:volume-small-linear')
    }
  }

  cycleSpeed() {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]
    const currentIndex = speeds.indexOf(this.audio.playbackRate)
    const nextIndex = (currentIndex + 1) % speeds.length
    this.audio.playbackRate = speeds[nextIndex]
    if (this.dom.speedBtn) {
      this.dom.speedBtn.textContent = speeds[nextIndex] + 'x'
    }
  }

  updateProgress() {
    const { currentTime, duration } = this.audio
    if (!duration) return
    const percent = (currentTime / duration) * 100

    if (this.dom.progressFill) {
      this.dom.progressFill.style.width = percent + '%'
    }
    if (this.mode === 'listing' && this.dom.timeDisplay) {
      this.dom.timeDisplay.textContent = this.formatTime(currentTime) + ' / ' + this.formatTime(duration)
    }
    if (this.mode === 'single' && this.dom.currentTime) {
      this.dom.currentTime.textContent = this.formatTime(currentTime)
    }
  }

  updateDuration() {
    const dur = this.audio.duration
    if (this.mode === 'listing' && this.dom.timeDisplay) {
      this.dom.timeDisplay.textContent = '00:00 / ' + this.formatTime(dur)
    }
    if (this.mode === 'single' && this.dom.duration) {
      this.dom.duration.textContent = this.formatTime(dur)
    }
  }

  syncVisualizerState() {
    if (!this.dom.visualizer) return
    if (this.isPlaying) {
      this.dom.visualizer.classList.remove('paused')
    } else {
      this.dom.visualizer.classList.add('paused')
    }
  }

  updatePlayPauseIcon() {
    if (!this.dom.playIcon) return
    this.dom.playIcon.setAttribute('icon', this.isPlaying ? 'solar:pause-bold' : 'solar:play-bold')
  }

  formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '--:--'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0')
  }
}

// ─── Intersection Observer for Fade-up Animations ───
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
      fadeObserver.unobserve(entry.target)
    }
  })
}, {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
})

function observeFadeUps() {
  document.querySelectorAll('.fade-up:not(.visible)').forEach(el => fadeObserver.observe(el))
}

document.addEventListener('DOMContentLoaded', () => {
  observeFadeUps()

  // ─── Mobile Menu: wire up button click ───
  const menuBtn = document.getElementById('mobile-menu-btn')
  if (menuBtn) menuBtn.addEventListener('click', toggleMenu)

  // Close menu on click outside
  document.addEventListener('click', (e) => {
    if (!menuOpen) return
    const menu = document.getElementById('mobile-menu')
    const btn = document.getElementById('mobile-menu-btn')
    if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
      closeMenu()
    }
  })

  // Close menu on resize past md breakpoint (768px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeMenu()
  })

  // ─── Guest Search Functionality ───
  const searchInput = document.getElementById('guestSearch')
  const guestCards = document.querySelectorAll('.guest-card')
  const noResults = document.getElementById('noResults')

  if (searchInput && guestCards.length > 0 && noResults) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase()
      let hasResults = false

      guestCards.forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase()
        const company = card.getAttribute('data-company').toLowerCase()

        if (name.includes(query) || company.includes(query)) {
          card.style.display = 'block'
          hasResults = true
        } else {
          card.style.display = 'none'
        }
      })

      if (!hasResults) {
        noResults.classList.remove('hidden')
        noResults.classList.add('visible')
      } else {
        noResults.classList.add('hidden')
      }
    })
  }

  // ─── Podcast Listing Page ───
  if (document.getElementById('episodes-grid')) {
    initPodcastListing()
  }

  // ─── Podcast Single Episode Page ───
  if (document.getElementById('ep-title')) {
    initPodcastSingle()
  }
})

// ─── Helpers ───
function formatDate(isoDate) {
  if (!isoDate) return 'Coming Soon'
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Podcast Listing Page ───
const EPISODES_PER_PAGE = 9
let allEpisodes = []
let visibleCount = EPISODES_PER_PAGE

async function initPodcastListing() {
  try {
    const res = await fetch('/data/episodes.json')
    allEpisodes = await res.json()

    if (allEpisodes.length > 0) {
      renderLatestEpisode(allEpisodes[0])
      renderUpNext(allEpisodes.slice(1, 4))

      // Initialize audio player
      window.audioPlayer = new AudioPlayer({ mode: 'listing' })
      window.audioPlayer.setQueue(allEpisodes)
      window.audioPlayer.loadEpisode(allEpisodes[0])

      // Hero "Play Latest Episode" button
      const heroPlayBtn = document.getElementById('hero-play-btn')
      if (heroPlayBtn) {
        heroPlayBtn.addEventListener('click', () => {
          window.audioPlayer.play()
          document.getElementById('visualizer')?.closest('section')
            ?.scrollIntoView({ behavior: 'smooth' })
        })
      }
    }

    renderEpisodeGrid()

    const loadMoreBtn = document.getElementById('load-more-btn')
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        visibleCount += EPISODES_PER_PAGE
        renderEpisodeGrid()
      })
    }

    // ─── Episode Search ───
    const episodeSearch = document.getElementById('episodeSearch')
    const searchClear = document.getElementById('episodeSearchClear')
    const noEpisodeResults = document.getElementById('noEpisodeResults')

    if (episodeSearch) {
      episodeSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim()

        if (searchClear) {
          searchClear.classList.toggle('hidden', !query)
        }

        if (!query) {
          noEpisodeResults?.classList.add('hidden')
          renderEpisodeGrid()
          return
        }

        const filtered = allEpisodes.filter(ep =>
          ep.name.toLowerCase().includes(query) ||
          ep.description.toLowerCase().includes(query)
        )

        const grid = document.getElementById('episodes-grid')
        const delays = ['delay-100', 'delay-200', 'delay-300']

        grid.innerHTML = filtered.map((ep, i) => createEpisodeCard(ep, delays[i % 3])).join('')
        observeFadeUps()

        if (loadMoreBtn) loadMoreBtn.classList.add('hidden')

        if (filtered.length === 0) {
          noEpisodeResults?.classList.remove('hidden')
        } else {
          noEpisodeResults?.classList.add('hidden')
        }
      })

      if (searchClear) {
        searchClear.addEventListener('click', () => {
          episodeSearch.value = ''
          episodeSearch.dispatchEvent(new Event('input'))
          episodeSearch.focus()
        })
      }
    }
  } catch (err) {
    console.error('Failed to load episodes:', err)
  }
}

function renderLatestEpisode(ep) {
  const img = document.getElementById('latest-ep-image')
  const link = document.getElementById('latest-ep-link')
  const num = document.getElementById('latest-ep-number')
  const title = document.getElementById('latest-ep-title')
  const desc = document.getElementById('latest-ep-description')

  if (img) img.src = ep.image
  if (img) img.alt = ep.name
  if (link) link.href = '/podcast-single.html?episode=' + ep.slug
  if (num) num.textContent = 'Episode ' + ep.episodeNumber
  if (title) title.textContent = ep.name
  if (desc) desc.textContent = ep.description
}

function renderUpNext(episodes) {
  const list = document.getElementById('up-next-list')
  if (!list) return

  list.innerHTML = episodes.map((ep, i) => `
    <div class="p-4 hover:bg-white/5 transition-colors cursor-pointer flex gap-4 group border-b border-white/5 last:border-0" onclick="playFromQueue(${i + 1})">
      <div class="w-12 h-12 rounded bg-neutral-800 overflow-hidden flex-shrink-0">
        <img src="${ep.image}" alt="${ep.name}" class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" loading="lazy">
      </div>
      <div class="min-w-0">
        <div class="text-xs text-neutral-500 mb-1">Episode ${ep.episodeNumber}</div>
        <div class="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors line-clamp-1">${ep.name}</div>
        <div class="text-xs text-neutral-600 mt-1">${formatDate(ep.date)}</div>
      </div>
      <div class="ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity text-orange-500 flex-shrink-0">
        <iconify-icon icon="solar:play-bold" width="20"></iconify-icon>
      </div>
    </div>
  `).join('')
}

function playFromQueue(index) {
  if (window.audioPlayer) {
    window.audioPlayer.playFromQueue(index)
    const ep = allEpisodes[index]
    if (ep) renderLatestEpisode(ep)
  }
}
window.playFromQueue = playFromQueue

function createEpisodeCard(ep, delayClass) {
  const videoBadge = ep.videoUrl
    ? '<span class="flex items-center gap-1 text-orange-500"><iconify-icon icon="solar:videocamera-record-linear"></iconify-icon> Video</span>'
    : ''

  return `
    <a href="/podcast-single.html?episode=${ep.slug}" class="fade-up ${delayClass} group flex flex-col h-full bg-neutral-900/20 border border-white/5 rounded-xl overflow-hidden hover:border-orange-500/30 transition-all hover:-translate-y-1">
      <div class="relative aspect-[4/3] overflow-hidden">
        <img src="${ep.image}" alt="${ep.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
        <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">EP ${ep.episodeNumber}</div>
        <div class="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
          <iconify-icon icon="solar:play-bold" width="14"></iconify-icon>
        </div>
      </div>
      <div class="p-6 flex flex-col flex-grow">
        <h3 class="text-lg font-medium text-white mb-3 group-hover:text-orange-500 transition-colors">${ep.name}</h3>
        <p class="text-sm text-neutral-500 font-light mb-4 line-clamp-3 flex-grow">${ep.description}</p>
        <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-500">
          <span class="flex items-center gap-1"><iconify-icon icon="solar:calendar-linear"></iconify-icon> ${formatDate(ep.date)}</span>
          ${videoBadge}
        </div>
      </div>
    </a>
  `
}

function renderEpisodeGrid() {
  const grid = document.getElementById('episodes-grid')
  const loadMoreBtn = document.getElementById('load-more-btn')
  if (!grid) return

  const delays = ['delay-100', 'delay-200', 'delay-300']
  const visible = allEpisodes.slice(0, visibleCount)
  grid.innerHTML = visible.map((ep, i) => createEpisodeCard(ep, delays[i % 3])).join('')

  observeFadeUps()

  if (loadMoreBtn) {
    if (visibleCount >= allEpisodes.length) {
      loadMoreBtn.classList.add('hidden')
    } else {
      loadMoreBtn.classList.remove('hidden')
    }
  }
}

// ─── Podcast Single Episode Page ───
async function initPodcastSingle() {
  const params = new URLSearchParams(window.location.search)
  const slug = params.get('episode')

  if (!slug) {
    window.location.href = '/podcast.html'
    return
  }

  try {
    const res = await fetch('/data/episodes.json')
    const episodes = await res.json()
    const episode = episodes.find(ep => ep.slug === slug)

    if (!episode) {
      document.getElementById('ep-title').textContent = 'Episode Not Found'
      document.getElementById('ep-description').textContent = 'This episode could not be found. Please go back to the podcast page.'
      return
    }

    populateEpisodePage(episode)

    // Initialize audio player for this episode
    if (episode.audioUrl) {
      window.audioPlayer = new AudioPlayer({ mode: 'single' })
      window.audioPlayer.loadEpisode(episode)
    }

    if (episode.hasTranscript) {
      loadTranscript(episode.slug)
    } else {
      document.getElementById('transcript-body').innerHTML =
        '<p class="text-neutral-500 italic">Transcript not available for this episode.</p>'
    }

    loadShowNotes(episode.slug, episode.hasTranscript)
  } catch (err) {
    console.error('Failed to load episode:', err)
    document.getElementById('ep-title').textContent = 'Error Loading Episode'
  }
}

function populateEpisodePage(ep) {
  document.title = ep.name + ' — The Authority Formula Podcast'
  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc) metaDesc.setAttribute('content', ep.description)
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.setAttribute('content', ep.name)
  const ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc) ogDesc.setAttribute('content', ep.description)

  const breadcrumb = document.getElementById('ep-breadcrumb-info')
  if (breadcrumb) breadcrumb.textContent = 'Ep ' + ep.episodeNumber

  const title = document.getElementById('ep-title')
  if (title) title.textContent = ep.name

  const desc = document.getElementById('ep-description')
  if (desc) desc.textContent = ep.description

  const dateEl = document.getElementById('ep-date')
  if (dateEl) dateEl.innerHTML = '<iconify-icon icon="solar:calendar-linear"></iconify-icon> ' + formatDate(ep.date)

  const thumb = document.getElementById('ep-thumbnail')
  if (thumb) { thumb.src = ep.image; thumb.alt = ep.name }

  const badge = document.getElementById('ep-badge')
  if (badge) badge.textContent = 'EP ' + ep.episodeNumber

  // Video embed
  if (ep.videoUrl) {
    const videoSection = document.getElementById('video-section')
    const videoIframe = document.getElementById('video-iframe')
    const videoBadge = document.getElementById('ep-video-badge')
    if (videoSection && videoIframe) {
      const videoId = ep.videoUrl.split('youtu.be/')[1] || ep.videoUrl.split('v=')[1]
      if (videoId) {
        videoIframe.src = 'https://www.youtube.com/embed/' + videoId
        videoSection.classList.remove('hidden')
      }
    }
    if (videoBadge) videoBadge.classList.remove('hidden')
  }
}

async function loadTranscript(slug) {
  try {
    const res = await fetch('/data/transcripts/' + slug + '.html')
    if (!res.ok) throw new Error('Not found')
    const html = await res.text()
    document.getElementById('transcript-body').innerHTML = html
  } catch {
    document.getElementById('transcript-body').innerHTML =
      '<p class="text-neutral-500 italic">Transcript not available for this episode.</p>'
  }
}

// ─── Show Notes, Links & Guest Card ───
async function loadShowNotes(slug, hasTranscript) {
  try {
    const res = await fetch('/data/show-notes.json')
    if (!res.ok) throw new Error('Show notes not found')
    const allNotes = await res.json()
    const notes = allNotes[slug]

    if (notes) {
      if (notes.guest && notes.guest.name) {
        populateGuestCard(notes.guest)
      }
      populateShowNotesTab(notes.keyPoints || [])
      populateLinksTab(notes.links || [])
    } else {
      setTabFallback('shownotes-body', 'Show notes not available for this episode.')
      setTabFallback('links-body', 'No links available for this episode.')
    }

    if (!hasTranscript) {
      if (notes && notes.keyPoints && notes.keyPoints.length > 0) {
        switchTab('shownotes')
      }
    }
  } catch (err) {
    console.error('Failed to load show notes:', err)
    setTabFallback('shownotes-body', 'Show notes not available.')
    setTabFallback('links-body', 'Links not available.')
  }
}

function populateGuestCard(guest) {
  const card = document.getElementById('guest-card')
  if (!card) return

  const nameEl = document.getElementById('guest-name')
  const roleEl = document.getElementById('guest-role')
  const bioEl = document.getElementById('guest-bio')
  const badgeEl = document.getElementById('guest-title-badge')

  if (nameEl) nameEl.textContent = guest.name
  if (roleEl) roleEl.textContent = guest.title || ''
  if (bioEl) bioEl.textContent = guest.bio || ''
  if (badgeEl && guest.title) {
    badgeEl.textContent = guest.title.length > 40 ? guest.title.slice(0, 40) + '…' : guest.title
    badgeEl.classList.remove('hidden')
  }

  card.classList.remove('hidden')
}

function populateShowNotesTab(keyPoints) {
  const container = document.getElementById('shownotes-body')
  if (!container || keyPoints.length === 0) {
    setTabFallback('shownotes-body', 'Show notes not available for this episode.')
    return
  }

  container.innerHTML = `
    <p class="text-neutral-300 mb-6">Key topics discussed in this episode:</p>
    <ul class="space-y-4">
      ${keyPoints.map((point, i) => `
        <li class="flex items-start gap-3">
          <span class="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold flex items-center justify-center mt-0.5">${i + 1}</span>
          <span class="text-neutral-300 font-light">${point}</span>
        </li>
      `).join('')}
    </ul>
  `
}

function populateLinksTab(links) {
  const container = document.getElementById('links-body')
  if (!container || links.length === 0) {
    setTabFallback('links-body', 'No links available for this episode.')
    return
  }

  container.innerHTML = links.map(link => `
    <a href="${link.url}" target="_blank" rel="noopener noreferrer"
       class="flex items-center gap-3 p-4 rounded-lg border border-white/5 hover:border-orange-500/30 hover:bg-white/5 transition-all group">
      <div class="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
        <iconify-icon icon="solar:link-round-angle-linear" class="text-orange-500"></iconify-icon>
      </div>
      <div class="min-w-0 flex-1">
        <span class="text-sm text-neutral-200 group-hover:text-white transition-colors block truncate">${link.text}</span>
        <span class="text-xs text-neutral-600 block truncate">${link.url}</span>
      </div>
      <iconify-icon icon="solar:arrow-right-up-linear" class="text-neutral-600 group-hover:text-orange-500 transition-colors flex-shrink-0"></iconify-icon>
    </a>
  `).join('')
}

function setTabFallback(containerId, message) {
  const el = document.getElementById(containerId)
  if (el) el.innerHTML = '<p class="text-neutral-500 italic">' + message + '</p>'
}
