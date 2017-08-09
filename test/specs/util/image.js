import image from 'util/image';
import Images from 'fixtures/dom/Image/fileReaderData';
  

  describe('util/image', function() {
    describe('#isCMYK', function() {
      it('detects a CMYK jpeg image properly', function() {
        expect(image.isCMYK(image.getBinaryFromDataUri(Images.cmykKoala.result))).toBeTruthy();
      });

      it('detects a non-CMYK jpeg image properly', function() {
        expect(image.isCMYK(image.getBinaryFromDataUri(Images.rgbGrant.result))).toBeFalsy();
      });

      it('detects a non-jpeg image properly', function() {
        expect(image.isCMYK(image.getBinaryFromDataUri(Images.animatedGif.result))).toBeFalsy();
      });
    });

    describe('#isAnimatedGif', function() {
      it('detects an animated gif properly', function() {
        expect(image.isAnimatedGif(image.getBinaryFromDataUri(Images.animatedGif.result))).toBeTruthy();
      });

      it('detects a non-gif image properly', function() {
        expect(image.isAnimatedGif(image.getBinaryFromDataUri(Images.rgbGrant.result))).toBeFalsy();
      });
    });

    describe('#getDimensions', function() {
      it('returns dimensions when a gif is provided', function() {
        expect(image.getDimensions(image.getBinaryFromDataUri(Images.animatedGif.result))).toEqual({
          width: 500,
          height: 609
        });
      });

      it('throws when a non-gif is provided', function() {
        expect(function() {
          image.getDimensions(image.getBinaryFromDataUri(Images.rgbGrant.result));
        }).toThrow();
      });
    });
  });

