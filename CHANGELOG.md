# 0.2.0 (2019-11-04)


### Bug Fixes

* debug and resolve runner problems ([e790168](https://github.com/despan/choker/commit/e7901682ed2e090a344985bc899de9298d21632f))
* emulate latency for requests ([e7104d0](https://github.com/despan/choker/commit/e7104d05d5c01ff32af0c654c28573c853195b25))
* respect `Backoff(0)` case to pass test suite ([a2e2c0a](https://github.com/despan/choker/commit/a2e2c0aa9655967cc88f2e2738cf406078745576))
* return only results (in correct order) ([46be7ed](https://github.com/despan/choker/commit/46be7ed6365f3da04cbcd03b28f04db114afdbe4))
* runner return total results ([0290d76](https://github.com/despan/choker/commit/0290d76b05be006f06946cbe24e7dabd88626052))
* support input of non-primitive list ([1d30564](https://github.com/despan/choker/commit/1d305641b377a736668708f1c001e2f3d699664f))
* swap runner args order ([46afe1b](https://github.com/despan/choker/commit/46afe1bbf1ceae807832c4f51b9dc5fd2dc4e46a))
* **runner:** move exec function code to `vendor/client` ([831b1f6](https://github.com/despan/choker/commit/831b1f6ae9fbb7af6ee9b8af2760836e413dbaa6))
* **runner:** reimplement with threads and united log ([4a5f390](https://github.com/despan/choker/commit/4a5f3902ca90442cd303fa3cdff0beb4454592ad))
* **runner:** reset args including `interval` ([7fcdad8](https://github.com/despan/choker/commit/7fcdad8354e4d478294f4eba82f37feac599f2db))
* update runner to match new server API ([8031539](https://github.com/despan/choker/commit/80315394fbc98e16458583db8dada685a5d9fa4c))
* use plain Array input (no Iterables) ([f211071](https://github.com/despan/choker/commit/f211071d58ec27213c5f8b4916551ca24f480af0))


### Features

* implement naive queue processing ([33f7c9b](https://github.com/despan/choker/commit/33f7c9b73b4fa8b56f349af0cba149c2ca5be903))


### Reverts

* fix: debug and resolve runner problems ([d2e51d7](https://github.com/despan/choker/commit/d2e51d7f9c496371570f56c33e2c4b8ea33f4081))



## 0.1.1 (2019-11-04)


### Bug Fixes

* respect `Backoff(0)` case to pass test suite ([a2e2c0a](https://github.com/despan/choker/commit/a2e2c0aa9655967cc88f2e2738cf406078745576))



# 0.1.0 (2019-11-02)


### Fixes

* support input of non-primitive list ([1d30564](https://github.com/despan/choker/commit/1d305641b377a736668708f1c001e2f3d699664f))
* swap runner args order ([46afe1b](https://github.com/despan/choker/commit/46afe1bbf1ceae807832c4f51b9dc5fd2dc4e46a))
* reimplement with threads and united log ([4a5f390](https://github.com/despan/choker/commit/4a5f3902ca90442cd303fa3cdff0beb4454592ad))
* reset args including `interval` ([7fcdad8](https://github.com/despan/choker/commit/7fcdad8354e4d478294f4eba82f37feac599f2db))
* return total results ([0290d76](https://github.com/despan/choker/commit/0290d76b05be006f06946cbe24e7dabd88626052))
* use plain Array input (no Iterables) ([f211071](https://github.com/despan/choker/commit/f211071d58ec27213c5f8b4916551ca24f480af0))


### Features

* implement naive queue processing ([33f7c9b](https://github.com/despan/choker/commit/33f7c9b73b4fa8b56f349af0cba149c2ca5be903))
